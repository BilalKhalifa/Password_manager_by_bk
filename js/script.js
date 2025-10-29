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
  
      $.ajax({
        url: 'php/auth.php', // PHP file to handle form logic
        type: 'POST',
        data: formData,
        success: function(response) {
          // Check the response from the PHP script
          if (response === 'success') {
            $('#message').text('Operation successful!').css('color', 'green');
            // Redirect to another page, e.g., dashboard.html
            setTimeout(function() {
              window.location.href = 'dashboard.html';
            }, 1000); // Wait 1 seconds before redirecting
          } else {
            $('#message').text(response).css('color', 'red'); // Display error message
          }
        },
        error: function() {
          $('#message').text('There was an error. Please try again.').css('color', 'red');
        }
      });
    });
});
