<?php
session_start();
session_unset();
session_destroy();
setcookie("naturenest_user", "", time() - 3600, "/"); 
header('Content-Type: application/json');
echo json_encode(["status" => "success"]);
?>