<?php
session_start();
require 'db.php';

if (!isset($_SESSION['user_id'])) {
    echo "You must be logged in.";
    exit;
}

$user_id = $_SESSION['user_id'];

$sql = "SELECT id, website_url, site_username, site_password FROM passwords WHERE user_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        echo '<div class="password-entry" style="border:1px solid #ddd; padding:10px; margin-bottom:10px;">';
        echo '<p><strong>Website:</strong> ' . htmlspecialchars($row['website_url']) . '</p>';
        echo '<p><strong>Username:</strong> ' . htmlspecialchars($row['site_username']) . '</p>';
        echo '<p><strong>Password:</strong> ' . htmlspecialchars($row['site_password']) . '</p>';
        // Delete button with data-id attribute holding the password id
        echo '<button class="delete-btn" data-id="' . $row['id'] . '" style="background:#f44336;color:white;border:none;padding:5px 10px;cursor:pointer;">Delete</button>';
        echo '</div>';
    }
} else {
    echo '<p>No passwords saved yet.</p>';
}

$stmt->close();
$conn->close();
?>