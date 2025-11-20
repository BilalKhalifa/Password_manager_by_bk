$(document).ready(function() {
    // Toggle between login and registration forms
    $('#toggle-link').click(function(e) {
      e.preventDefault();  // Prevent default link behavior
      if ($('#action').val() === 'login') {
        $('#form-title').text('Register');
        $('#submit-btn').text('Register');
        $('#action').val('register');
        $('#toggle-text').html('Already have an account? <a href="#" id="toggle-link">Login here</a>');
      } else {
        $('#form-title').text('Login');
        $('#submit-btn').text('Login');
        $('#action').val('login');
        $('#toggle-text').html('Don\'t have an account? <a href="#" id="toggle-link">Register here</a>');
      }
    });
  
    // Handle form submission (Login/Register)
    $('#auth-form').submit(function(e) {
      e.preventDefault(); // Prevent the default form submission
  
      var formData = $(this).serialize(); // Get form data as URL-encoded string
  
      // Determine action and build payload
      const action = $('#action').val();
      const payload = {
        username: $('#username').val(),
        password: $('#password').val()
      };

      const endpoint = action === 'register' ? '/api/register' : '/api/login';

      $.ajax({
        url: endpoint,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(payload),
        success: function(response) {
          // Expect JSON response from Node backend
          if (response && response.success) {
            // store token if present
            if (response.token) localStorage.setItem('pm_token', response.token);
            $('#message').text(response.message || 'Operation successful!').css('color', 'green');
            setTimeout(function() { window.location.href = 'dashboard.html'; }, 1000);
          } else {
            const msg = (response && response.error) ? response.error : (typeof response === 'string' ? response : 'Operation failed');
            $('#message').text(msg).css('color', 'red');
          }
        },
        error: function(xhr) {
          let msg = 'There was an error. Please try again.';
          if (xhr && xhr.responseJSON && xhr.responseJSON.error) msg = xhr.responseJSON.error;
          $('#message').text(msg).css('color', 'red');
        }
      });
    });
});
