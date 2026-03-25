<?php
session_start();
require 'db.php';
header('Content-Type: application/json');
if (!isset($_SESSION['user_name'])) {
    echo json_encode(["status" => "error", "message" => "Unauthorized. Please login."]);
    exit;
}
$farmer_name = $_SESSION['user_name'];
$name = $_POST['name'] ?? '';
$category = $_POST['category'] ?? '';
$unit = $_POST['unit'] ?? '';
$price = $_POST['price'] ?? 0;
$stock = $_POST['stock'] ?? 0;
$nameLower = strtolower($name);
$image_path = "📦";
if(strpos($nameLower, 'tomato') !== false) $image_path = '🍅';
else if(strpos($nameLower, 'potato') !== false) $image_path = '🥔';
else if(strpos($nameLower, 'onion') !== false) $image_path = '🧅';
else if(strpos($nameLower, 'apple') !== false) $image_path = '🍎';
else if(strpos($nameLower, 'banana') !== false) $image_path = '🍌';
else if(strpos($nameLower, 'carrot') !== false) $image_path = '🥕';
if (!file_exists('uploads')) {
    mkdir('uploads', 0777, true);
}
if (isset($_FILES['image']) && $_FILES['image']['error'] == 0) {
    $target_dir = "uploads/";
    $file_name = time() . "_" . preg_replace("/[^a-zA-Z0-9.]/", "", basename($_FILES["image"]["name"]));
    $target_file = $target_dir . $file_name;
    $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));
    if(in_array($imageFileType, ["jpg", "png", "jpeg", "webp"])) {
        if (move_uploaded_file($_FILES["image"]["tmp_name"], $target_file)) {
            $image_path = $target_file;
        }
    }
}
$stmt = $conn->prepare("INSERT INTO products (farmer_name, name, category, unit_type, price, stock, image_path) VALUES (?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssssiis", $farmer_name, $name, $category, $unit, $price, $stock, $image_path);
if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Produce added to live market!"]);
} else {
    echo json_encode(["status" => "error", "message" => "Database error."]);
}
?>