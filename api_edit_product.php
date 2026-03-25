<?php
session_start();
require 'db.php';
header('Content-Type: application/json');
if (!isset($_SESSION['user_name'])) {
    echo json_encode(["status" => "error", "message" => "Unauthorized."]);
    exit;
}
$id = $_POST['id'] ?? 0;
$price = $_POST['price'] ?? 0;
$stock = $_POST['stock'] ?? 0;
$stmt = $conn->prepare("UPDATE products SET price = ?, stock = ? WHERE id = ?");
$stmt->bind_param("iii", $price, $stock, $id);
if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Product updated successfully!"]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to update product."]);
}
?>