<?php
$host = 'localhost';     // XAMPP default
$db   = 'password_manager'; // Your database name
$user = 'root';          // Default XAMPP username
$pass = '';              // Default XAMPP password is empty
$conn = new mysqli($host, $user, $pass, $db);

// Check connection
if ($conn->connect_error) {
    die('Connection failed: ' . $conn->connect_error);
}
?>
