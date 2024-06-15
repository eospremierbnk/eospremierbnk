'use strict';

//  EDIT User MODEL
function showEditTransactionModal(button) {
  const transactionId = button.getAttribute('data-User-id');
  fetch(`/editStatement/${transactionId}`)
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
        const editTransaction = data.editTransactionInfo;
        const formContent = document.getElementById(
          'editTransactionFormContent'
        );

        let content = `
            <div class="col-12 d-flex main_flex_div">
                <div class="col-4 d-flex flex-column inner_flex_div">
                    <label for="amount">Amount:</label>
                    <input type="text" id="amount" name="amount" value="${
                      editTransaction.amount || ''
                    }">
                    <input type="hidden" name="_id" value="${
                      editTransaction._id
                    }">
                </div>
                <div class="col-4 d-flex flex-column inner_flex_div">
                    <label for="type">Type:</label>
                    <input type="text" id="type" name="type" value="${
                      editTransaction.type || ''
                    }">
                </div>
                <div class="col-4 d-flex flex-column inner_flex_div">
                    <label for="paidIn">PaidIn:</label>
                    <input type="paidIn" id="paidIn" name="paidIn" value="${
                      editTransaction.paidIn || ''
                    }">
                </div>
            </div>
            <div class="col-12 d-flex main_flex_div">
                <div class="col-4 d-flex flex-column inner_flex_div">
                    <label for="paidOut">PaidOut:</label>
                    <input type="text" id="paidOut" name="paidOut" value="${
                      editTransaction.paidOut || ''
                    }">
                </div>
                <div class="col-6 d-flex flex-column inner_flex_div">
                    <label for="description">Description</label>
                    <textarea id="description" name="description">
                                ${editTransaction.description || ''}
                    </textarea>
                   
                </div>
  
            </div>
           
        `;

        formContent.innerHTML = content;
        const modal = document.getElementById('editTransactionModal');
        modal.style.display = 'block';
      } else {
        console.log('Fetch data error:', data); // Log data in case of failure
        alert('Transaction not found');
      }
    })
    .catch((error) => {
      console.error('Fetch Error:', error); // Log the error details
      alert('An error occurred while fetching transaction.');
    });
}

function closeEditTransactionModal() {
  const modal = document.getElementById('editTransactionModal');
  modal.style.display = 'none';
}

//Submit edit product modal
document
  .getElementById('editTransactionForm')
  .addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const transactionId = formData.get('_id');

    const formObject = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(
        `/admin/editStatementPost/${transactionId}`,
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
        showToast('Transaction successfully updated', 'success');
        closeEditTransactionModal();
        window.location.href = data.redirectUrl;
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  });

// DELETE User MODAL
function showDeleteTransactionModal(button) {
  const transactionId = button.getAttribute('data-User-id');
  const url = button.getAttribute('data-url');

  if (confirm('Are you sure you want to delete this Transaction?')) {
    fetch(`${url}/${transactionId}`, {
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
          showToast('Transaction deleted successfully', 'success');
          window.location.href = data.redirectUrl;
        } else {
          showToast('Error deleting product', 'error');
        }
      })
      .catch((error) => {
        showToast('Error deleting product: ' + error.message, 'error');
      });
  }
}
