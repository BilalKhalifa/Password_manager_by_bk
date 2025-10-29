<?php
$host = "gateway01.ap-southeast-1.prod.aws.tidbcloud.com";
$port = 4000;
$username = "2Xr1GuCBUH9StSP.root";  // your TiDB username
$password = "DpKtz9uIzTgSXDFz"; // your generated password
$dbname = "password_manager";

$ssl_ca = __DIR__ . "/../certs/ca-cert.pem";

// Create connection
$conn = mysqli_init();
mysqli_ssl_set($conn, NULL, NULL, $ssl_ca, NULL, NULL);
mysqli_real_connect($conn, $host, $username, $password, $dbname, $port, NULL, MYSQLI_CLIENT_SSL);

// Check connection
if (mysqli_connect_errno()) {
    die("Connection failed: " . mysqli_connect_error());
}
