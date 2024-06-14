'use strict';

// VIEW User MODAL
function showViewUserModal(button) {
  const userId = button.getAttribute('data-User-id');
  const url = button.getAttribute('data-url');

  fetch(`${url}/${userId}`)
    .then((response) => {
      if (!response.ok) {
        return response.text().then((text) => {
          throw new Error(text || 'Network response was not ok');
        });
      }
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        const user = data.userInfo;
        const modalContent = document.getElementById('modalContent');

        let content = `
          <table class="table table-bordered">
            <tr><th>Full Name</th><td>${user.firstName} ${
          user.lastName
        }</td></tr>
            <tr><th>Email</th><td>${user.email}</td></tr>
            <tr><th>Username</th><td>${user.username}</td></tr>
            <tr><th>Phone</th><td>${user.number}</td></tr>
            <tr><th>Address</th><td>${user.address} ${user.city} ${
          user.state
        }</td></tr>
            <tr><th>Savings Account Number</th><td>${
              user.savingsAccountNumber
            }</td></tr>
            <tr><th>Checking Account Number</th><td>${
              user.checkingAccountNumber
            }</td></tr>
            <tr><th>Savings Account Type</th><td>${
              user.savingAccountType
            }</td></tr>
             <tr><th>Checking Account Type</th><td>${
               user.checkingAccountType
             }</td></tr>
            <tr><th>SWIFT Code</th><td>${user.swiftCode}</td></tr>
            <tr><th>Savings Account Balance</th><td>${
              user.savingAccountBalance
            }</td></tr>
             <tr><th>Checking Account Balance</th><td>${
               user.checkingAccountBalance
             }</td></tr>
            <tr><th>Card Type</th><td>${user.cardType}</td></tr>
            <tr><th>Card Balance</th><td>${user.cardBalance}</td></tr>
            <tr><th>Card Number</th><td>${user.cardNumber}</td></tr>
            <tr><th>PIN</th><td>${user.pin}</td></tr>
             <tr><th>Account Status</th><td>${user.accountStatus}</td></tr>
            <tr><th>Date Added</th><td>${new Date(
              user.date_added
            ).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}</td></tr>
          </table>
        `;
        modalContent.innerHTML = content;
        const modal = document.getElementById('viewUserModal');
        modal.style.display = 'block';
      } else {
        alert('User details not found');
      }
    })
    .catch((error) => {
      alert('An error occurred while fetching user details.');
    });
}

function closeViewUserModal() {
  const modal = document.getElementById('viewUserModal');
  modal.style.display = 'none';
}

//  EDIT User MODEL
function showEditUserModal(button) {
  const userId = button.getAttribute('data-User-id');
  fetch(`/editUser/${userId}`)
    .then((response) => {
      if (!response.ok) {
        return response.text().then((text) => {
          throw new Error(text || 'Network response was not ok');
        });
      }
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        const editUser = data.editUserInfo;
        const formContent = document.getElementById('editUserFormContent');

        let content = `
            <div class="col-12 d-flex main_flex_div">
                <div class="col-4 d-flex flex-column inner_flex_div">
                    <label for="firstName">Firstname:</label>
                    <input type="text" id="firstName" name="firstName" value="${
                      editUser.firstName || ''
                    }">
                    <input type="hidden" name="_id" value="${editUser._id}">
                </div>
                <div class="col-4 d-flex flex-column inner_flex_div">
                    <label for="lastName">LastName:</label>
                    <input type="text" id="lastName" name="lastName" value="${
                      editUser.lastName || ''
                    }">
                </div>
                <div class="col-4 d-flex flex-column inner_flex_div">
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" value="${
                      editUser.email || ''
                    }">
                </div>
            </div>
            <div class="col-12 d-flex main_flex_div">
                <div class="col-4 d-flex flex-column inner_flex_div">
                    <label for="username">Username:</label>
                    <input type="text" id="username" name="username" value="${
                      editUser.username || ''
                    }">
                </div>
                <div class="col-4 d-flex flex-column inner_flex_div">
                    <label for="number">Number</label>
                    <input type="number" id="number" name="number" value="${
                      editUser.number || ''
                    }">
                </div>
                 <div class="col-4 d-flex flex-column inner_flex_div">
                    <label for="address">Address:</label>
                    <input type="text" id="username" name="address" value="${
                      editUser.address || ''
                    }">
                </div>
            </div>
            <div class="col-12 d-flex main_flex_div">
               
                <div class="col-4 d-flex flex-column inner_flex_div">
                    <label for="city">City</label>
                    <input type="text" id="city" name="city" value="${
                      editUser.city || ''
                    }">
                </div>
                <div class="col-4 d-flex flex-column inner_flex_div">
                    <label for="state">State:</label>
                    <input type="text" id="state" name="state" value="${
                      editUser.state || ''
                    }">
                </div>
                 <div class="col-4 d-flex flex-column inner_flex_div">
                     <label for="savingsAccountNumber">Savings Account Number:</label>
                    <input type="text" id="savingsAccountNumber" name="savingsAccountNumber" value="${
                      editUser.savingsAccountNumber || ''
                    }">
                </div>
            </div>
             <div class="col-12 d-flex main_flex_div">
               
                <div class="col-4 d-flex flex-column inner_flex_div">
                     <label for="checkingAccountNumber">Checking Account Number:</label>
                    <input type="text" id="checkingAccountNumber" name="checkingAccountNumber" value="${
                      editUser.checkingAccountNumber || ''
                    }">
                </div>

                 <div class="col-4 d-flex flex-column inner_flex_div">
                    <label for="savingAccountType">Savings Account Type:</label>
                    <input type="text" id="savingAccountType" name="savingAccountType" value="${
                      editUser.savingAccountType || ''
                    }">
                </div>
                 <div class="col-4 d-flex flex-column inner_flex_div">
                    <label for="checkingAccountType">Checking Account Type:</label>
                    <input type="text" id="checkingAccountType" name="checkingAccountType" value="${
                      editUser.checkingAccountType || ''
                    }">
                </div>
            </div>

            <div class="col-12 d-flex main_flex_div">
               
                 <div class="col-4 d-flex flex-column inner_flex_div">
                    <label for="swiftCode">Swift Code</label>
                    <input type="text" id="swiftCode" name="swiftCode" value="${
                      editUser.swiftCode || ''
                    }">
                </div>
                <div class="col-4 d-flex flex-column inner_flex_div">
                    <label for="savingAccountBalance">Checking Balance:</label>
                    <input type="text" id="savingAccountBalance" name="savingAccountBalance" value="${
                      editUser.savingAccountBalance || ''
                    }">
                </div>
                 <div class="col-4 d-flex flex-column inner_flex_div">
                    <label for="checkingAccountBalance">Checking Balance:</label>
                    <input type="text" id="checkingAccountBalance" name="checkingAccountBalance" value="${
                      editUser.checkingAccountBalance || ''
                    }">
                </div>
            </div>
             <div class="col-12 d-flex main_flex_div">

                <div class="col-4 d-flex flex-column inner_flex_div">
                    <label for="cardBalance">Crad Balance</label>
                    <input type="text" id="cardBalance" name="cardBalance" value="${
                      editUser.cardBalance || ''
                    }">
                </div>   
               
                 <div class="col-4 d-flex flex-column inner_flex_div">
                    <label for="cardNumber">Card Number</label>
                    <input type="text" id="cardNumber" name="cardNumber" value="${
                      editUser.cardNumber || ''
                    }">
                </div>     
                
                <div class="col-4 d-flex flex-column inner_flex_div">
                    <label for="pin">Pin</label>
                    <input type="text" id="pin" name="pin" value="${
                      editUser.pin || ''
                    }">
                </div>  
            </div>
           
        `;

        formContent.innerHTML = content;
        const modal = document.getElementById('editUserModal');
        modal.style.display = 'block';
      } else {
        console.log('Fetch data error:', data); // Log data in case of failure
        alert('User details not found');
      }
    })
    .catch((error) => {
      console.error('Fetch Error:', error); // Log the error details
      alert('An error occurred while fetching User details.');
    });
}

function closeEditUserModal() {
  const modal = document.getElementById('editUserModal');
  modal.style.display = 'none';
}

//Submit edit product modal
document
  .getElementById('editUserForm')
  .addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const userId = formData.get('_id');

    const formObject = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(`/admin/editUserPost/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formObject),
      });
      const data = await response.json();
      if (response.ok) {
        showToast('User successfully updated', 'success');
        closeEditUserModal();
        window.location.href = data.redirectUrl;
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  });

// DELETE User MODAL
function showDeleteUserModal(button) {
  const UserId = button.getAttribute('data-User-id');
  const url = button.getAttribute('data-url');

  if (confirm('Are you sure you want to delete this User?')) {
    fetch(`${url}/${UserId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.message || 'Error deleting product');
          });
        }
        return response.json();
      })
      .then((data) => {
        if (data.redirectUrl) {
          showToast('User deleted successfully', 'success');
          window.location.href = data.redirectUrl; // Redirect based on received redirectUrl
        } else {
          showToast('Error deleting product', 'error');
        }
      })
      .catch((error) => {
        showToast('Error deleting product: ' + error.message, 'error');
      });
  }
}
