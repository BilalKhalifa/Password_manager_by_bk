$(document).ready(function () {
    // Function to fetch passwords and display inside container
    function fetchPasswords() {
  const token = localStorage.getItem('token');
      if (!token) { $('#passwords-container').html('<p>Not authenticated.</p>'); return; }
      $.ajax({
        url: '/api/passwords',
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token },
        success: function (res) {
          if (!res || !res.success) { $('#passwords-container').html('<p>Failed to load passwords.</p>'); return; }
          const rows = res.passwords;
          if (!rows || rows.length === 0) { $('#passwords-container').html('<p>No passwords saved yet.</p>'); return; }
          let html = '';
          rows.forEach(r => {
            html += '<div class="password-entry" style="border:1px solid #ddd; padding:10px; margin-bottom:10px;">';
            html += '<p><strong>Website:</strong> ' + $('<div>').text(r.website_url).html() + '</p>';
            html += '<p><strong>Username:</strong> ' + $('<div>').text(r.site_username).html() + '</p>';
            html += '<p><strong>Password:</strong> ' + $('<div>').text(r.site_password).html() + '</p>';
            html += '<button class="delete-btn" data-id="' + r.id + '" style="background:#f44336;color:white;border:none;padding:5px 10px;cursor:pointer;">Delete</button>';
            html += '</div>';
          });
          $('#passwords-container').html(html);
        },
        error: function () {
          $('#passwords-container').html('<p>Failed to load passwords.</p>');
        }
      });
    }
  
    fetchPasswords(); // Load passwords on page load
  
    // Show modal when clicking the Add button
    $('#add-btn').click(function () {
      $('#add-modal').show();
    });
  
    // Close modal when clicking the close icon
    $('.close').click(function () {
      $('#add-modal').hide();
      $('#add-form')[0].reset();
      $('#add-message').text('');
    });
  
    // Submit new password via AJAX
    $('#add-form').submit(function (e) {
      e.preventDefault();
  
      var formData = $(this).serialize();
  
      const token = localStorage.getItem('pm_token');
      if (!token) { $('#add-message').css('color','red').text('Not authenticated.'); return; }
      // read inputs by name (ids added in HTML) to be robust
      const payload = {
        website: $('#site-website').val() || $('#add-form input[name="website"]').val(),
        username: $('#site-username').val() || $('#add-form input[name="username"]').val(),
        password: $('#site-password').val() || $('#add-form input[name="password"]').val()
      };
      $.ajax({
        url: '/api/passwords',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(payload),
        headers: { 'Authorization': 'Bearer ' + token },
        success: function (res) {
          if (res && res.success) {
            $('#add-message').css('color', 'green').text('Password saved!');
            fetchPasswords();
            setTimeout(() => { $('#add-modal').hide(); $('#add-form')[0].reset(); $('#add-message').text(''); }, 1000);
          } else {
            $('#add-message').css('color', 'red').text((res && res.error) ? res.error : 'Error adding password.');
          }
        },
        error: function () { $('#add-message').css('color', 'red').text('Error adding password.'); }
      });
    });
  
    // Handle Delete button click event (using event delegation)
    $(document).on('click', '.delete-btn', function () {
      if (!confirm('Are you sure you want to delete this password?')) return;
  
      const passwordId = $(this).data('id');
  
  const token = localStorage.getItem('token');
      if (!token) { alert('Not authenticated.'); return; }
      $.ajax({
        url: '/api/passwords/' + passwordId,
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + token },
        success: function (res) {
          if (res && res.success) { alert('Password deleted successfully.'); fetchPasswords(); }
          else { alert('Failed to delete password.'); }
        },
        error: function () { alert('Error communicating with server.'); }
      });
    });
  
    // Logout button handling
    $('#logout-btn').click(function () {
      localStorage.removeItem('pm_token');
      window.location.href = 'index.html';
    });
  });