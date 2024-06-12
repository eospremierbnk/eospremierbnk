'use strict';
const paginatedResults = (model, filter = {}) => {
  return async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = 6;

    try {
      const totalItems = await model.countDocuments(filter);
      const totalPages = Math.ceil(totalItems / perPage);

      const results = await model
        .find(filter)
        .sort({ date_added: -1 })
        .skip((page - 1) * perPage)
        .limit(perPage)
        .exec();

      res.paginatedResults = {
        results,
        currentPage: page,
        totalPages,
      };
      next();
    } catch (error) {
      console.error('Error retrieving information:', error);
      res.status(500).send('Error retrieving information');
    }
  };
};

// fliter to diaply order for user and merchant that sign in .
const userOrdersFilter = (req) => {
  if (req.currentUser) {
    return { user: req.currentUser._id };
  }
  return {};
};
const merchantOrdersFilter = (req) => {
  if (req.currentMerchant) {
    return { 'cartItems.merchantId': req.currentAdmin._id };
  }
  return {};
};

const merchantProductsFilter = (req) => {
  if (req.currentMerchant) {
    return { merchantId: req.currentMerchant._id };
  }
  return {};
};

module.exports = {
  paginatedResults,

  userOrdersFilter,
  merchantOrdersFilter,
  merchantProductsFilter,
};
