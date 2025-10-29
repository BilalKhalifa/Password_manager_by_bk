<?php
include("db.php");
if ($conn) {
    echo "✅ Connected successfully to TiDB Cloud!";
} else {
    echo "❌ Connection failed!";
}
