'use strict';

// VIEW BENEFICIARY MODAL
function showViewBeneficiaryModal(button) {
  const beneficiaryId = button.getAttribute('data-beneficiary-id');
  const url = button.getAttribute('data-url');

  fetch(`${url}/${beneficiaryId}`)
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
        const beneficiary = data.beneficiaryInfo;
        const modalContent = document.getElementById('modalContent');

        let content = `
          <table class="table table-bordered">
            <tr><th>Full Name</th><td>${beneficiary.firstName} ${
          beneficiary.lastName
        }</td></tr>
            <tr><th>Email</th><td>${beneficiary.email}</td></tr>
            <tr><th>Phone</th><td>${beneficiary.number}</td></tr>
            <tr><th>ID Number</th><td>${beneficiary.idNumber}</td></tr>
            <tr><th>Account Type</th><td>${beneficiary.accountType}</td></tr>
            <tr><th>Address</th><td>${beneficiary.address}, ${
          beneficiary.city
        }, ${beneficiary.state}, ${beneficiary.zipcode}</td></tr>
            <tr><th>Date Added</th><td> ${new Date(
              beneficiary.date_added
            ).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
         </td></tr>
          </table>
        `;

        modalContent.innerHTML = content;
        const modal = document.getElementById('viewBeneficiaryModal');
        modal.style.display = 'block';
      } else {
        alert('Beneficiary details not found');
      }
    })
    .catch((error) => {
      alert('An error occurred while fetching beneficiary details.');
    });
}

function closeViewBeneficiaryModal() {
  const modal = document.getElementById('viewBeneficiaryModal');
  modal.style.display = 'none';
}

//  EDIT beneficiary MODEL
function showEditBeneficiaryModal(button) {
  const beneficiaryId = button.getAttribute('data-beneficiary-id');

  fetch(`/editBeneficiary/${beneficiaryId}`)
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
        const editBeneficiary = data.editBeneficiaryInfo;
        const formContent = document.getElementById(
          'editBeneficiaryFormContent'
        );

        let content = `
            <div class="col-12 d-flex main_flex_div">
                <div class="col-4 d-flex flex-column inner_flex_div">
                    <label for="firstName">Firstname:</label>
                    <input type="text" id="firstName" name="firstName" value="${
                      editBeneficiary.firstName || ''
                    }">
                    <input type="hidden" name="_id" value="${
                      editBeneficiary._id
                    }">
                </div>
                <div class="col-4 d-flex flex-column inner_flex_div">
                    <label for="lastName">LastName:</label>
                    <input type="text" id="lastName" name="lastName" value="${
                      editBeneficiary.lastName || ''
                    }">
                </div>
                <div class="col-4 d-flex flex-column inner_flex_div">
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" value="${
                      editBeneficiary.email || ''
                    }">
                </div>
            </div>
            <div class="col-12 d-flex main_flex_div">
                <div class="col-4 d-flex flex-column inner_flex_div">
                    <label for="number">Number:</label>
                    <input type="number" id="number" name="number" value="${
                      editBeneficiary.number || ''
                    }">
                </div>
                <div class="col-4 d-flex flex-column inner_flex_div">
                    <label for="idNumber">Id Number</label>
                    <input type="number" id="idNumber" name="idNumber" value="${
                      editBeneficiary.idNumber || ''
                    }">
                </div>
                <div class="col-4 d-flex flex-column inner_flex_div">
                    <label for="accountType">Account Type:</label>
                    <input type="text" id="accountType" name="accountType" value="${
                      editBeneficiary.accountType || ''
                    }">
                </div>
            </div>
            <div class="col-12 d-flex main_flex_div">
                <div class="col-4 d-flex flex-column inner_flex_div">
                    <label for="relationship">Relationship:</label>
                    <input type="text" id="relationship" name="relationship" value="${
                      editBeneficiary.relationship || ''
                    }">
                </div>
                <div class="col-4 d-flex flex-column inner_flex_div">
                    <label for="address">Address</label>
                    <input type="text" id="address" name="address" value="${
                      editBeneficiary.address || ''
                    }">
                </div>
                <div class="col-4 d-flex flex-column inner_flex_div">
                    <label for="city">City:</label>
                    <input type="text" id="city" name="city" value="${
                      editBeneficiary.city || ''
                    }">
                </div>
            </div>
            <div class="col-12 d-flex main_flex_div">
                <div class="col-4 d-flex flex-column inner_flex_div">
                    <label for="state">State:</label>
                    <input type="text" id="state" name="state" value="${
                      editBeneficiary.state || ''
                    }">
                </div>
                <div class="col-4 d-flex flex-column inner_flex_div">
                    <label for="zipcode">Zipcode</label>
                    <input type="number" id="zipcode" name="zipcode" value="${
                      editBeneficiary.zipcode || ''
                    }">
                </div>
            </div>
        `;

        formContent.innerHTML = content;
        const modal = document.getElementById('editBeneficiaryModal');
        modal.style.display = 'block';
      } else {
        console.log('Fetch data error:', data); // Log data in case of failure
        alert('Beneficiary details not found');
      }
    })
    .catch((error) => {
      console.error('Fetch Error:', error); // Log the error details
      alert('An error occurred while fetching beneficiary details.');
    });
}

function closeEditBeneficiaryModal() {
  const modal = document.getElementById('editBeneficiaryModal');
  modal.style.display = 'none';
}

//Submit edit product modal
document
  .getElementById('editBeneficiaryForm')
  .addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const beneficiaryId = formData.get('_id');

    const formObject = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(
        `/user/editBeneficiaryPost/${beneficiaryId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formObject),
        }
      );
      const data = await response.json();
      if (response.ok) {
        showToast('Beneficiary successfully updated', 'success');
        closeEditBeneficiaryModal();
        window.location.href = data.redirectUrl;
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  });

// DELETE beneficiary MODAL
function showDeleteBeneficiaryModal(button) {
  const beneficiaryId = button.getAttribute('data-beneficiary-id');
  const url = button.getAttribute('data-url');

  if (confirm('Are you sure you want to delete this beneficiary?')) {
    fetch(`${url}/${beneficiaryId}`, {
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
          showToast('Beneficiary deleted successfully', 'success');
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
