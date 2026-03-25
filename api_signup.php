<?php
session_start();
require 'db.php';
header('Content-Type: application/json');
$name = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';
$role = $_POST['role'] ?? 'customer';
$location = $_POST['location'] ?? 'Not provided';
if (!preg_match("/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/", $email)) {
    echo json_encode(["status" => "error", "message" => "Invalid email format!"]);
    exit;
}
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
if ($stmt->get_result()->num_rows > 0) {
    echo json_encode(["status" => "error", "message" => "Email already registered!"]);
    exit;
}
$stmt = $conn->prepare("INSERT INTO users (name, email, password, role, location) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sssss", $name, $email, $password, $role, $location);
if ($stmt->execute()) {
    $_SESSION['user_id'] = $stmt->insert_id;
    $_SESSION['user_name'] = $name;
    echo json_encode(["status" => "success", "message" => "Account created successfully!", "name" => $name, "role" => $role]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to create account."]);
}
?>