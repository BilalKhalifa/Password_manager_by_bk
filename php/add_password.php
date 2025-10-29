<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    echo "Unauthorized";
    exit;
}

require 'db.php';

// Get POST data from form inputs named website, username, password
$website_url = trim($_POST['website'] ?? '');
$site_username = trim($_POST['username'] ?? '');
$site_password = trim($_POST['password'] ?? '');

// Validate input fields
if ($website_url === '' || $site_username === '' || $site_password === '') {
    echo "All fields are required.";
    exit;
}

$user_id = $_SESSION['user_id'];

// Prepare SQL statement with correct column names from your schema
$stmt = $conn->prepare("INSERT INTO passwords (user_id, website_url, site_username, site_password) VALUES (?, ?, ?, ?)");

if (!$stmt) {
    echo "Database Error: " . $conn->error;
    exit;
}

$stmt->bind_param("isss", $user_id, $website_url, $site_username, $site_password);

if ($stmt->execute()) {
    echo "success";
} else {
    echo "Error: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>