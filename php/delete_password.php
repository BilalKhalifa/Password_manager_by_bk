<?php
session_start();
require 'db.php';

if (!isset($_SESSION['user_id'])) {
    echo "User not logged in.";
    exit;
}

if (empty($_POST['password_id'])) {
    echo "No password specified.";
    exit;
}

$user_id = $_SESSION['user_id'];
$password_id = intval($_POST['password_id']);

$sql = "DELETE FROM passwords WHERE id = ? AND user_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $password_id, $user_id);

if ($stmt->execute()) {
    echo "success";
} else {
    echo "Failed to delete password.";
}

$stmt->close();
$conn->close();
?>