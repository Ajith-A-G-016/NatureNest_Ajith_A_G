<?php
session_start();
require 'db.php';
header('Content-Type: application/json');
$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';
$role = $_POST['role'] ?? 'customer';
$stmt = $conn->prepare("SELECT id, name FROM users WHERE email = ? AND password = ? AND role = ?");
$stmt->bind_param("sss", $email, $password, $role);
$stmt->execute();
$result = $stmt->get_result();
if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_name'] = $user['name'];
    if (isset($_COOKIE['naturenest_cookie_consent']) && $_COOKIE['naturenest_cookie_consent'] === 'accepted') {
        setcookie("naturenest_user", $email, time() + (86400 * 30), "/"); 
    }
    echo json_encode(["status" => "success", "message" => "Login successful!", "name" => $user['name'], "role" => $role]);
} else {
    echo json_encode(["status" => "error", "message" => "Invalid Email, Password, or Role!"]);
}
?>