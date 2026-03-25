let cart = JSON.parse(localStorage.getItem('natureNestCart_v6')) || [];
let liveProducts = [];

function showToast(message) {
    let toast = document.getElementById('global-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'global-toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.innerHTML = `<div class="toast-success-icon">✓</div> ${message}`;
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); }, 3000);
}

function renderCookieBanner() {
    if (document.cookie.indexOf('naturenest_cookie_consent=') === -1) {
        const banner = document.createElement('div');
        banner.className = 'cookie-banner';
        banner.id = 'cookie-banner';
        banner.innerHTML = `
            <p>This website uses cookies and local storage for authentication and cart personalization. We use our own cookies to keep you logged in. Only essential session cookies are turned on by default.</p>
            <button class="cookie-btn-allow" onclick="acceptCookies()">Allow all cookies</button>
            <button class="cookie-btn-decline" onclick="declineCookies()">Do not allow cookies</button>
        `;
        document.body.appendChild(banner);
    }
}

function acceptCookies() {
    document.cookie = "naturenest_cookie_consent=accepted; max-age=" + (60*60*24*30) + "; path=/";
    document.getElementById('cookie-banner').style.display = 'none';
    showToast('Cookies accepted!');
}

function declineCookies() {
    document.cookie = "naturenest_cookie_consent=rejected; max-age=" + (60*60*24*30) + "; path=/";
    document.getElementById('cookie-banner').style.display = 'none';
    showToast('Cookies declined.');
}

function updateCartBadge() {
    const badges = document.querySelectorAll('#cart-badge');
    badges.forEach(badge => {
        badge.innerText = cart.length;
        if(cart.length > 0) {
            badge.style.display = 'inline-block';
            badge.style.animation = 'fadeIn 0.3s ease';
        } else {
            badge.style.display = 'none';
        }
    });
}

function updateHeader() {
    const authLink = document.getElementById('auth-nav-link');
    const currentUser = JSON.parse(localStorage.getItem('natureNestCurrentUser'));
    if (authLink) {
        if (currentUser) {
            authLink.innerText = 'Logout';
            authLink.style.color = '#ef4444';
            authLink.style.background = '#fee2e2';
            authLink.style.padding = '0.5rem 1.2rem';
            authLink.style.borderRadius = '99px';
            authLink.style.fontWeight = '700';
            authLink.onclick = logout;
        } else {
            authLink.innerText = 'Login';
            authLink.style.color = 'var(--primary)';
            authLink.style.background = 'transparent';
            authLink.style.padding = '0';
            authLink.style.fontWeight = '700';
            authLink.onclick = () => openLogin('customer');
        }
    }
}

function openLogin(role) {
    localStorage.setItem('currentRole', role);
    window.location.href = 'login.html';
}

function openSignup(role) {
    localStorage.setItem('currentRole', role);
    window.location.href = 'signup.html';
}

function setRole(role) {
    localStorage.setItem('currentRole', role);
    updateAuthUI();
}

function updateAuthUI() {
    const role = localStorage.getItem('currentRole') || 'customer';
    const loginTitle = document.getElementById('login-title');
    if (loginTitle) loginTitle.innerText = role === 'farmer' ? 'Farmer Login' : 'Customer Login';
    const signupTitle = document.getElementById('signup-title');
    if (signupTitle) signupTitle.innerText = role === 'farmer' ? 'Farmer Sign Up' : 'Customer Sign Up';
    const btnFarmer = document.getElementById('btn-farmer');
    const btnCustomer = document.getElementById('btn-customer');
    if (btnFarmer && btnCustomer) {
        if (role === 'farmer') {
            btnFarmer.className = 'btn-role btn-green';
            btnCustomer.className = 'btn-role btn-outline';
        } else {
            btnFarmer.className = 'btn-role btn-outline';
            btnCustomer.className = 'btn-role btn-green';
        }
    }
}

function getLocation() {
    const locationInput = document.getElementById('signup-location');
    const locationBtn = document.getElementById('location-btn');
    if (navigator.geolocation) {
        locationBtn.innerText = '⏳...';
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
                    const data = await response.json();
                    const addr = data.address;
                    const district = addr.state_district || addr.city_district || addr.county || addr.city || addr.town || "";
                    const state = addr.state || "";
                    let locationStr = [district, state].filter(Boolean).join(", ");
                    if (!locationStr) locationStr = `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
                    locationInput.value = locationStr;
                    locationBtn.innerText = '✅ Done';
                    locationBtn.style.background = '#047857';
                    locationBtn.style.color = 'white';
                    showToast('Location detected!');
                } catch (error) {
                    locationInput.value = `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
                    locationBtn.innerText = '✅ Done';
                }
            },
            (error) => {
                showToast('GPS access denied.');
                locationBtn.innerText = '📍 Detect';
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    } else {
        showToast('Geolocation not supported.');
    }
}

function handleSignup(e) {
    e.preventDefault();
    const name = $('#signup-name').val();
    const email = $('#signup-email').val();
    const password = $('#signup-password').val();
    const location = $('#signup-location').length ? $('#signup-location').val() : 'Not provided';
    const role = localStorage.getItem('currentRole') || 'customer';
    
    $.ajax({
        url: 'api_signup.php',
        type: 'POST',
        dataType: 'json',
        data: { name: name, email: email, password: password, role: role, location: location },
        success: function(response) {
            if (response.status === 'success') {
                showToast(response.message);
                localStorage.setItem('natureNestCurrentUser', JSON.stringify({name: response.name, role: response.role}));
                setTimeout(() => { window.location.href = response.role === 'farmer' ? 'farmer.html' : 'products.html'; }, 1000);
            } else { showToast(response.message); }
        },
        error: function() { showToast('Server error. Ensure XAMPP Apache & MySQL are running.'); }
    });
}

function handleLogin(e) {
    e.preventDefault(); 
    const email = $('#login-email').val();
    const password = $('#login-password').val();
    const role = localStorage.getItem('currentRole') || 'customer';
    
    $.ajax({
        url: 'api_login.php',
        type: 'POST',
        dataType: 'json',
        data: { email: email, password: password, role: role },
        success: function(response) {
            if (response.status === 'success') {
                showToast(response.message);
                localStorage.setItem('natureNestCurrentUser', JSON.stringify({name: response.name, role: response.role}));
                setTimeout(() => { window.location.href = response.role === 'farmer' ? 'farmer.html' : 'products.html'; }, 1000);
            } else { showToast(response.message); }
        },
        error: function() { showToast('Server error.'); }
    });
}

function logout() {
    $.ajax({
        url: 'api_logout.php',
        type: 'GET',
        success: function() {
            localStorage.removeItem('natureNestCurrentUser');
            showToast('Logged out successfully!');
            setTimeout(() => { window.location.href = 'index.html'; }, 1000);
        }
    });
}

function handleAddProduct(e) {
    e.preventDefault();
    let formData = new FormData();
    formData.append('name', $('#product-name').val());
    formData.append('category', $('#product-category').val());
    formData.append('unit', $('#product-unit').val());
    formData.append('price', $('#product-price').val());
    formData.append('stock', $('#product-stock').val());
    
    let fileInput = $('#fileInput')[0].files[0];
    if(fileInput) {
        formData.append('image', fileInput);
    }
    $.ajax({
        url: 'api_add_product.php',
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function(response) {
            if (response.status === 'success') {
                showToast(response.message);
                e.target.reset();
                $('#imagePreview').hide();
                $('#uploadText').show();
                fetchProducts();
            } else {
                showToast("Error: " + response.message);
            }
        },
        error: function(xhr, status, error) {
            showToast('Server error! Check console for details.');
        }
    });
}

function fetchProducts() {
    if (!$('#product-grid').length) return;
    $.ajax({
        url: 'api_get_products.php',
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            liveProducts = data;
            displayProducts(liveProducts);
        }
    });
}

function filterMarket() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const filtered = liveProducts.filter(p => p.name.toLowerCase().includes(query));
    displayProducts(filtered);
}

function displayProducts(dataToDisplay) {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) return; 
    productGrid.innerHTML = '';
    if (dataToDisplay.length === 0) {
        productGrid.innerHTML = '<p style="text-align:center; grid-column: 1/-1; color: var(--text-gray); font-size: 1.2rem; padding: 2rem;">No products available right now.</p>';
        return;
    }
    
    const currentUser = JSON.parse(localStorage.getItem('natureNestCurrentUser'));
    const isFarmer = currentUser && currentUser.role === 'farmer';

    dataToDisplay.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        let imageHTML = product.image_path.startsWith("uploads/") 
            ? `<img src="${product.image_path}" style="width:100%; height:100%; object-fit:cover;">`
            : `<div style="font-size: 6rem;">${product.image_path}</div>`;
            
        let actionBtn = isFarmer 
            ? `<button class="btn-role btn-outline" style="margin-top: 15px; padding: 0.8rem; border-radius: 12px; width: 100%;" onclick="editProduct(${product.id}, ${product.price}, ${product.stock})">Edit Price & Stock</button>`
            : `<button class="btn-role btn-green" style="margin-top: 15px; padding: 0.8rem; border-radius: 12px; width: 100%;" onclick="addToCart('${product.name}', ${product.price}, '${product.image_path}')">Add to Cart</button>`;

        card.innerHTML = `
            <div class="p-img-box" style="padding:0; overflow:hidden;">${imageHTML}</div>
            <div style="padding: 1.5rem;">
                <p style="color: var(--text-gray); font-size: 0.8rem; margin-bottom: 5px;">Farm: ${product.farmer_name}</p>
                <h4 style="font-size: 1.3rem; margin-bottom: 0.5rem; color: var(--text-dark);">${product.name}</h4>
                <p style="color: var(--primary); font-weight: 700; font-size: 1.2rem;">₹${product.price} <span style="font-size: 0.9rem; color: var(--text-gray); font-weight: 500;">/ ${product.unit_type}</span></p>
                ${actionBtn}
            </div>
        `;
        productGrid.appendChild(card);
    });
}

function editProduct(id, currentPrice, currentStock) {
    let newPrice = prompt("Enter new selling price (₹):", currentPrice);
    if (newPrice === null || newPrice.trim() === "") return;
    let newStock = prompt("Enter new available stock:", currentStock);
    if (newStock === null || newStock.trim() === "") return;
    $.ajax({
        url: 'api_edit_product.php',
        type: 'POST',
        dataType: 'json',
        data: { id: id, price: newPrice, stock: newStock },
        success: function(response) {
            showToast(response.message);
            if(response.status === 'success') { fetchProducts(); }
        },
        error: function() { showToast('Server error updating product.'); }
    });
}

function addToCart(name, price, image) {
    const currentUser = JSON.parse(localStorage.getItem('natureNestCurrentUser'));
    if (!currentUser) {
        showToast('Please login first to add items to cart!');
        setTimeout(() => { localStorage.setItem('currentRole', 'customer'); window.location.href = 'login.html'; }, 1500);
        return;
    }
    cart.push({ name, price, image });
    localStorage.setItem('natureNestCart_v6', JSON.stringify(cart));
    updateCartBadge();
    showToast(`${name} added to cart`);
}

function displayCart() {
    const cartContainer = document.getElementById('cart-items-container');
    const emptyCartMsg = document.getElementById('empty-cart-msg');
    const cartTotalSection = document.getElementById('cart-total-section');
    const cartTotalSpan = document.getElementById('cart-total');
    if (!cartContainer) return;
    cartContainer.innerHTML = '';
    let total = 0;
    if (cart.length === 0) {
        emptyCartMsg.style.display = 'block';
        cartTotalSection.style.display = 'none';
    } else {
        emptyCartMsg.style.display = 'none';
        cartTotalSection.style.display = 'block';
        cart.forEach((item, index) => {
            total += parseInt(item.price);
            const itemDiv = document.createElement('div');
            itemDiv.className = 'cart-item';
            
            let iconDisplay = item.image.startsWith("uploads/")
                ? `<img src="${item.image}" style="width:100%; height:100%; object-fit:cover; border-radius: 16px;">`
                : `<div style="font-size: 2.5rem;">${item.image}</div>`;

            itemDiv.innerHTML = `
                <div class="cart-item-info">
                    <span class="cart-item-icon" style="padding:0; overflow:hidden;">${iconDisplay}</span>
                    <div>
                        <h4 style="font-size: 1.3rem;">${item.name}</h4>
                        <p style="color: var(--primary); font-weight: 700; font-size: 1.2rem;">₹${item.price}</p>
                    </div>
                </div>
                <button class="btn-remove" onclick="removeFromCart(${index})">Remove</button>
            `;
            cartContainer.appendChild(itemDiv);
        });
        cartTotalSpan.innerText = total;
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('natureNestCart_v6', JSON.stringify(cart));
    displayCart();
    updateCartBadge();
    showToast('Item removed');
}

function displayCheckout() {
    const checkoutTotalSpan = document.getElementById('checkout-total');
    if (!checkoutTotalSpan) return;
    let total = 0;
    cart.forEach(item => total += parseInt(item.price));
    checkoutTotalSpan.innerText = total;
    if (total === 0) window.location.href = "products.html";
}

function handleCheckout(e) {
    e.preventDefault();
    if (cart.length === 0) {
        showToast("Your cart is empty!");
        return;
    }
    const name = $('input[placeholder="Who is receiving the order?"]').val();
    const phone = $('input[placeholder="10-digit mobile number"]').val();
    const address = $('input[placeholder="House No, Street, Landmark"]').val();
    const city = $('input[placeholder="e.g., Chennai"]').val();
    const pincode = $('input[placeholder="600001"]').val();
    const payment = $('select').val();
    const total = document.getElementById('checkout-total').innerText;
    $.ajax({
        url: 'api_checkout.php',
        type: 'POST',
        dataType: 'json',
        data: {
            name: name, phone: phone, address: address, city: city,
            pincode: pincode, payment: payment, total: total, cart: JSON.stringify(cart)
        },
        success: function(response) {
            if (response.status === 'success') {
                cart = [];
                localStorage.removeItem('natureNestCart_v6');
                updateCartBadge();
                const container = document.querySelector('.add-product-container');
                container.innerHTML = `
                    <div style="text-align: center; padding: 4rem 0;">
                        <div style="font-size: 6rem; margin-bottom: 1rem;">🎉</div>
                        <h2 style="color: var(--primary-dark); font-size: 2.5rem; margin-bottom: 1rem;">Order Successful!</h2>
                        <p style="color: var(--text-gray); margin-bottom: 2rem; font-size: 1.2rem;">Your fresh produce is being prepared and will be delivered soon.</p>
                        <button class="btn-role btn-green" style="width: auto; padding: 1rem 3rem;" onclick="window.location.href='index.html'">Return to Home</button>
                    </div>
                `;
            } else {
                showToast(response.message);
            }
        },
        error: function() { showToast('Server error during checkout.'); }
    });
}

$(document).ready(function() {
    $.ajax({
        url: 'api_check_auth.php',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.authenticated) {
                localStorage.setItem('natureNestCurrentUser', JSON.stringify(response.user));
            } else {
                localStorage.removeItem('natureNestCurrentUser');
                if (window.location.pathname.includes('farmer.html') || window.location.pathname.includes('checkout.html')) {
                    window.location.href = 'login.html';
                }
            }
            updateHeader();
            updateAuthUI();
            updateCartBadge();
            fetchProducts();
            renderCookieBanner();
            const farmerNameEl = document.getElementById('farmer-name');
            if (farmerNameEl) {
                const currentUser = JSON.parse(localStorage.getItem('natureNestCurrentUser'));
                farmerNameEl.innerText = currentUser ? currentUser.name : 'Farmer';
            }
            displayCart();
            displayCheckout();
        }
    });
});

function showPreview(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('imagePreview').src = e.target.result;
            document.getElementById('imagePreview').style.display = 'block';
            document.getElementById('uploadText').style.display = 'none';
        }
        reader.readAsDataURL(input.files[0]);
    }
}