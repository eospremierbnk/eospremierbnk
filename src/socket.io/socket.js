const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const cron = require('node-cron');
const { User, Admin, Message } = require('../models');
const config = require('../configs/customEnvVariables');

// Store socket ID for each user and admin
const userSockets = {};
const adminSockets = {};

const verifyToken = (socket, next) => {
  const token = socket.handshake.headers.cookie
    ? socket.handshake.headers.cookie
        .split('; ')
        .find(
          (c) =>
            c.startsWith('userAccessToken=') ||
            c.startsWith('adminAccessToken=')
        )
        .split('=')[1]
    : null;

  if (!token) {
    console.log('Authentication error: No token found');
    return next(new Error('Authentication error'));
  }

  let decoded;
  try {
    decoded = jwt.verify(token, config.jwtSecret);
    console.log('Token verified:', decoded);
  } catch (err) {
    console.log('Authentication error:', err);
    return next(new Error('Authentication error'));
  }

  const role = decoded.role ? 'Admin' : decoded.role ? 'User' : 'Unknown';
  socket.decoded = {
    ...decoded,
    role: role,
  };
  next();
};

const setupSocketIo = (server) => {
  const io = socketIo(server);
  io.use(verifyToken);

  io.on('connection', async (socket) => {
    console.log('A client connected:', socket.id);
    let name;
    let image;

    const convertToBase64 = (data, contentType) => {
      return `data:${contentType};base64,${data.toString('base64')}`;
    };

    if (socket.decoded.role === 'User') {
      const user = await User.findById(socket.decoded.id);

      if (!user) {
        console.log('User not found:', socket.decoded.id);
        socket.disconnect(); // or handle accordingly
        return;
      }

      name = `${user.firstName} ${user.lastName}`;
      image =
        user.image && user.image.data
          ? convertToBase64(user.image.data, user.image.contentType)
          : 'https://bootdey.com/img/Content/avatar/avatar5.png';
      userSockets[socket.decoded.id] = socket.id;
      const mainAdmin = await Admin.findOne({});
      socket.emit('userInfo', {
        userId: socket.decoded.id,
        userName: name,
        userImage: image,
        adminId: mainAdmin._id,
      });
    } else if (socket.decoded.role === 'Admin') {
      const admin = await Admin.findById(socket.decoded.id);

      if (!admin) {
        console.log('Admin not found:', socket.decoded.id);
        socket.disconnect(); // or handle accordingly
        return;
      }

      name = `${admin.firstName} ${admin.lastName}`;
      image =
        admin.image && admin.image.data
          ? convertToBase64(admin.image.data, admin.image.contentType)
          : 'https://bootdey.com/img/Content/avatar/avatar3.png';

      adminSockets[socket.decoded.id] = socket.id;
      socket.emit('adminInfo', {
        adminId: socket.decoded.id,
        adminName: name,
        adminImage: image,
      });

      // Emit list of all users to admin
      const users = await User.find({});
      const userList = users.map((user) => ({
        userId: user._id,
        userName: `${user.firstName} ${user.lastName}`,
        userImage:
          user.image && user.image.data
            ? convertToBase64(user.image.data, user.image.contentType)
            : 'https://bootdey.com/img/Content/avatar/avatar5.png',
      }));
      socket.emit('allUsers', userList);
    }

    socket.on(
      'privateMessage',
      async (
        { message, senderId, recipientId, senderImage, image },
        callback
      ) => {
        const senderRole = socket.decoded.role === 'User' ? 'User' : 'Admin';
        const recipientRole = socket.decoded.role === 'User' ? 'Admin' : 'User';

        const timeOptions = { hour: 'numeric', minute: 'numeric' };
        const time = new Date().toLocaleTimeString(undefined, timeOptions);
        const newMessage = new Message({
          senderId,
          sender: name,
          senderModel: senderRole,
          recipientId,
          recipientModel: recipientRole,
          message,
          senderImage,
          image,
          time: time,
          read: false,
        });
        await newMessage.save();

        const recipientSocketId =
          userSockets[recipientId] || adminSockets[recipientId];
        if (recipientSocketId) {
          socket.to(recipientSocketId).emit('receiveMessage', {
            sender: name,
            message,
            senderId,
            senderImage,
            unreadCount: 1,
            image,
          });
          console.log('Message sent to recipient:', recipientId);
        }
        callback({ status: 'ok' });
      }
    );

    socket.on('typing', ({ isTyping, recipientId }) => {
      const recipientSocketId =
        userSockets[recipientId] || adminSockets[recipientId];
      if (recipientSocketId) {
        socket
          .to(recipientSocketId)
          .emit('typing', { isTyping, senderId: socket.decoded.id });
        console.log('Typing event sent to recipient:', recipientId);
      }
    });

    socket.on('loadChatHistory', async (userId, callback) => {
      const chatHistory = await Message.find({
        $or: [
          { senderId: userId, recipientId: socket.decoded.id },
          { senderId: socket.decoded.id, recipientId: userId },
        ],
      }).sort({ time: 1 });
      console.log('Chat history loaded for user:', userId);

      callback(chatHistory);
    });

    socket.on('disconnect', () => {
      if (socket.decoded.role === 'User') {
        delete userSockets[socket.decoded.id];
      } else if (socket.decoded.role === 'Admin') {
        delete adminSockets[socket.decoded.id];
      }
      console.log('Client disconnected:', socket.id);
    });
  });

  // Schedule a daily cleanup job at midnight
  cron.schedule('0 0 * * *', async () => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 1); // 1 day ago
    await Message.deleteMany({ time: { $lt: cutoff } });
    // console.log('Old messages deleted');
  });
};

module.exports = setupSocketIo;
