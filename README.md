# 🌿 NatureNest - Fresh & Fair

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![jQuery](https://img.shields.io/badge/jquery-%230769AD.svg?style=for-the-badge&logo=jquery&logoColor=white)
![PHP](https://img.shields.io/badge/php-%23777BB4.svg?style=for-the-badge&logo=php&logoColor=white)
![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)

**NatureNest** is an online agriculture marketplace platform designed to connect farmers directly with customers. It helps farmers sell their agricultural products at a fair and profitable price, while customers can buy fresh and natural farm products without middlemen. The platform aims to promote sustainable farming, transparency in pricing, and better income opportunities for farmers. Customers benefit by getting fresh, organic, and high-quality products delivered directly from farms.

---

## ✨ Key Features

### 🚜 For Farmers
* **Dedicated Dashboard:** A clean, intuitive interface to manage farm business.
* **0% Commission:** Keep 100% of the profits.
* **Product Management:** Easily list new produce. Supports real image uploads or auto-generated emojis (📦, 🍅, 🍎).
* **Live Editing:** Update prices and stock availability on the fly using AJAX.

### 🛒 For Customers
* **Live Market:** Browse a dynamic grid of fresh vegetables, fruits, and grains.
* **Search & Filter:** Instantly find specific produce using the real-time search bar.
* **Secure Cart System:** Add, review, and remove items before checkout.
* **Streamlined Checkout:** Place orders seamlessly with multiple payment options (UPI, Card, COD).

### 🔒 Core System Features
* **Role-Based Authentication:** Secure Login and Signup tailored for either Farmers or Customers.
* **Session & Cookie Management:** Users stay securely logged in across sessions using PHP cookies, accompanied by a custom, fully functional Cookie Consent banner.
* **High-Accuracy GPS Integration:** HTML5 Geolocation API combined with OpenStreetMap Reverse Geocoding to auto-detect exact exact coordinates, districts, and states during signup.
* **Asynchronous Operations:** Fully AJAX-driven frontend using jQuery for smooth, page-reload-free interactions.
* **Email Simulation:** Backend PHP triggers an order confirmation sequence that logs email details to a local `.txt` file on the server.

---

## 🛠️ Technology Stack

* **Frontend:** HTML5, CSS3 (Custom Variables, Flexbox, CSS Grid), Vanilla JavaScript, jQuery, AJAX.
* **Backend:** PHP (Session management, Cookie tracking, File uploading).
* **Database:** MySQL (Relational data structuring, Foreign Keys).
* **Architecture:** Client-Server model running on a local Apache server (XAMPP).

---

## 🚀 Getting Started (Local Setup)

To run this project locally on your machine, follow these steps:

### Prerequisites
* Install [XAMPP](https://www.apachefriends.org/index.html) (comes with Apache and MySQL).

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/yourusername/NatureNest.git](https://github.com/yourusername/NatureNest.git)

## 📁 Project Structure

Here is the complete directory structure for the NatureNest application:

```text
NatureNest_Ajith_A_G/
│
├── naturenest.sql         # Database structure and default data dump
├── README.md              # Project documentation
│
├── api_add_product.php    # Handles product creation & image uploads
├── api_check_auth.php     # Validates active sessions and tracking cookies
├── api_checkout.php       # Processes orders and logs confirmation emails
├── api_edit_product.php   # Handles price/stock updates for farmers
├── api_get_products.php   # Fetches live market data from MySQL
├── api_login.php          # Handles user authentication & sessions
├── api_logout.php         # Destroys sessions and clears cookies securely
├── api_signup.php         # Handles registration & validation
├── db.php                 # MySQL database connection configuration
│
├── cart.html              # User Shopping Cart
├── checkout.html          # Order Processing UI
├── farmer.html            # Farmer Dashboard
├── index.html             # Landing Page
├── login.html             # Login UI
├── products.html          # Live Market UI
├── signup.html            # Registration UI
│
├── script.js              # Global jQuery/AJAX logic
├── style.css              # Global styling & animations
└── uploads/               # Directory for storing farmer image uploads
