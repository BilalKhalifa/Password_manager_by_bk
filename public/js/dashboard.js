$(document).ready(function () {
    // Function to fetch passwords and display inside container
    function fetchPasswords() {
      $.ajax({
        url: 'php/fetch_passwords.php',
        method: 'GET',
        success: function (data) {
          $('#passwords-container').html(data);
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
  
      $.ajax({
        url: 'php/add_password.php',
        method: 'POST',
        data: formData,
        success: function (response) {
          var trimmedResponse = response.trim();
          if (trimmedResponse === 'success') {
            $('#add-message').css('color', 'green').text('Password saved!');
            fetchPasswords();  // Refresh the password list
            setTimeout(() => {
              $('#add-modal').hide();
              $('#add-form')[0].reset();
              $('#add-message').text('');
            }, 1000);
          } else {
            $('#add-message').css('color', 'red').text(trimmedResponse);
          }
        },
        error: function () {
          $('#add-message').css('color', 'red').text('Error adding password.');
        }
      });
    });
  
    // Handle Delete button click event (using event delegation)
    $(document).on('click', '.delete-btn', function () {
      if (!confirm('Are you sure you want to delete this password?')) return;
  
      const passwordId = $(this).data('id');
  
      $.ajax({
        url: 'php/delete_password.php',
        method: 'POST',
        data: { password_id: passwordId },
        success: function (response) {
          if (response.trim() === 'success') {
            alert('Password deleted successfully.');
            fetchPasswords();
          } else {
            alert('Failed to delete password: ' + response);
          }
        },
        error: function () {
          alert('Error communicating with server.');
        }
      });
    });
  
    // Logout button handling
    $('#logout-btn').click(function () {
      window.location.href = 'php/logout.php';
    });
  });