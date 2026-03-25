<?php
session_start();
require 'db.php';
header('Content-Type: application/json');
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["status" => "error", "message" => "Please login to place an order."]);
    exit;
}
$user_id = $_SESSION['user_id'];
$name = $_POST['name'] ?? '';
$phone = $_POST['phone'] ?? '';
$address = $_POST['address'] ?? '';
$city = $_POST['city'] ?? '';
$pincode = $_POST['pincode'] ?? '';
$payment = $_POST['payment'] ?? '';
$total = $_POST['total'] ?? 0;
$cart_data = $_POST['cart'] ?? '';
$stmt = $conn->prepare("INSERT INTO orders (user_id, customer_name, phone, address, city, pincode, payment_method, total_amount, cart_data) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("issssssis", $user_id, $name, $phone, $address, $city, $pincode, $payment, $total, $cart_data);
if ($stmt->execute()) {
    $to = "customer@example.com"; 
    $subject = "NatureNest Order Confirmation";
    $message = "Hello $name,\n\nYour order for Rs. $total has been successfully placed!\nDelivery Address: $address, $city - $pincode.\nPayment Method: $payment.\n\nThank you for supporting local farmers!";
    $headers = "From: no-reply@naturenest.local";
    @mail($to, $subject, $message, $headers);
    file_put_contents("sent_emails_log.txt", "To: $to\nSubject: $subject\nMessage: $message\n------------------------\n", FILE_APPEND);
    echo json_encode(["status" => "success", "message" => "Order placed successfully!"]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to place order."]);
}
?>