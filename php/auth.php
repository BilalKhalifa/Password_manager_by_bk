<?php
// Enable error reporting for development (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database connection details
$host = 'localhost';
$db   = 'password_manager';
$user = 'root';
$pass = ''; // Adjust if needed
$charset = 'utf8mb4';

// Create connection
$conn = new mysqli($host, $user, $pass, $db);

// Check connection
if ($conn->connect_error) {
    die('Connection failed: ' . $conn->connect_error);
}

// Start the session
session_start();

// Get the form inputs
$action   = $_POST['action'] ?? '';
$username = trim($_POST['username'] ?? '');
$password = trim($_POST['password'] ?? '');

if ($action === 'register') {
    // Check if username already exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        echo "Username already taken";
    } else {
        // Insert new user (consider hashing password in production)
        $stmt = $conn->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
        $stmt->bind_param("ss", $username, $password);
        if ($stmt->execute()) {
            echo "success";
        } else {
            echo "Registration failed. Please try again.";
        }
    }
    $stmt->close();

} elseif ($action === 'login') {
    // Check credentials and retrieve user id
    $stmt = $conn->prepare("SELECT id FROM users WHERE username = ? AND password = ?");
    $stmt->bind_param("ss", $username, $password);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        // Set session variable for logged-in user
        $_SESSION['user_id'] = $row['id'];
        echo "success";
    } else {
        echo "Invalid username or password";
    }
    $stmt->close();

} else {
    echo "Invalid action";
}

// Close DB connection
$conn->close();
?>