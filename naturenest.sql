CREATE DATABASE IF NOT EXISTS naturenest;
USE naturenest;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    farmer_name VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    unit_type VARCHAR(20) NOT NULL,
    price INT NOT NULL,
    stock INT NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(50) NOT NULL,
    pincode VARCHAR(20) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    total_amount INT NOT NULL,
    cart_data TEXT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
INSERT INTO products (farmer_name, name, category, unit_type, price, stock, image_path) VALUES
('NatureNest Farm', 'Tomatoes', 'Vegetables', 'Per Kg', 40, 100, '🍅'),
('NatureNest Farm', 'Potatoes', 'Vegetables', 'Per Kg', 30, 100, '🥔'),
('NatureNest Farm', 'Onions', 'Vegetables', 'Per Kg', 35, 100, '🧅'),
('NatureNest Farm', 'Carrots', 'Vegetables', 'Per Kg', 50, 100, '🥕'),
('NatureNest Farm', 'Broccoli', 'Vegetables', 'Per Kg', 80, 100, '🥦'),
('NatureNest Farm', 'Eggplant', 'Vegetables', 'Per Kg', 45, 100, '🍆'),
('NatureNest Farm', 'Cucumber', 'Vegetables', 'Per Kg', 40, 100, '🥒'),
('NatureNest Farm', 'Bell Pepper', 'Vegetables', 'Per Kg', 60, 100, '🫑'),
('NatureNest Farm', 'Apples', 'Fruits', 'Per Kg', 150, 100, '🍎'),
('NatureNest Farm', 'Bananas', 'Fruits', 'Per Dozen', 60, 100, '🍌'),
('NatureNest Farm', 'Oranges', 'Fruits', 'Per Kg', 80, 100, '🍊'),
('NatureNest Farm', 'Mangoes', 'Fruits', 'Per Kg', 150, 100, '🥭'),
('NatureNest Farm', 'Strawberries', 'Fruits', 'Per Kg', 200, 100, '🍓'),
('NatureNest Farm', 'Wheat', 'Grains', 'Per Kg', 40, 500, '🌾'),
('NatureNest Farm', 'Rice', 'Grains', 'Per Kg', 50, 500, '🍚');