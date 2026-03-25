<?php
session_start();
require 'db.php';
header('Content-Type: application/json');
if (isset($_SESSION['user_id'])) {
    $stmt = $conn->prepare("SELECT name, role FROM users WHERE id = ?");
    $stmt->bind_param("i", $_SESSION['user_id']);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($user = $result->fetch_assoc()) {
        echo json_encode(["authenticated" => true, "user" => $user]);
        exit;
    }
}
if (isset($_COOKIE['naturenest_user']) && isset($_COOKIE['naturenest_cookie_consent']) && $_COOKIE['naturenest_cookie_consent'] === 'accepted') {
    $email = $_COOKIE['naturenest_user'];
    $stmt = $conn->prepare("SELECT id, name, role FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_name'] = $user['name'];
        echo json_encode(["authenticated" => true, "user" => ["name" => $user['name'], "role" => $user['role']]]);
        exit;
    }
}
echo json_encode(["authenticated" => false]);
?>