'use strict';
//Update User status
document.querySelectorAll('.account-status-select').forEach((select) => {
  select.addEventListener('change', function () {
    const userId = this.getAttribute('data-user-id');
    const accountStatus = this.value;
    const endpoint = `/admin/ourUsers/updateAccountStatus`;

    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, accountStatus }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          alert(data.message);
        } else {
          alert('Error updating account status');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Error updating account status');
      });
  });
});
