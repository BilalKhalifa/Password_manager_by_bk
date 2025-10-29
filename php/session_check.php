<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    // If the user is not logged in, redirect to login page
    header('Location: ../index.html');
    exit();
}
?>
