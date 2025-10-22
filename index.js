 // Global Variables
 let cart = JSON.parse(localStorage.getItem('cart')) || [];
 let products = [];
 let currentUser = JSON.parse(sessionStorage.getItem('currentUser')) || null;

 // Initialize the application
 document.addEventListener('DOMContentLoaded', function() {
     updateCartDisplay();
     checkLoginStatus();
     loadProducts();
     setupFormValidation();
 });

 // Page Navigation
 function showPage(pageId) {
     // Hide all pages
     const pages = document.querySelectorAll('.page');
     pages.forEach(page => page.style.display = 'none');
     
     // Hide register form
     document.getElementById('registerForm').style.display = 'none';
     
     // Show selected page
     const targetPage = document.getElementById(pageId + 'Page');
     if (targetPage) {
         targetPage.style.display = 'block';
     }
     
     // Update dashboard if showing dashboard
     if (pageId === 'dashboard' && currentUser) {
         updateDashboard();
     }
 }

 // Dark Mode Toggle
 function toggleDarkMode() {
     const body = document.body;
     const icon = document.getElementById('darkModeIcon');
     
     body.classList.toggle('dark-mode');
     
     if (body.classList.contains('dark-mode')) {
         icon.className = 'fas fa-sun';
         localStorage.setItem('darkMode', 'enabled');
     } else {
         icon.className = 'fas fa-moon';
         localStorage.setItem('darkMode', 'disabled');
     }
 }

 // Load dark mode preference
 if (localStorage.getItem('darkMode') === 'enabled') {
     document.body.classList.add('dark-mode');
     document.getElementById('darkModeIcon').className = 'fas fa-sun';
 }

 // Product Management
 async function loadProducts() {
     const loadingSpinner = document.getElementById('productsLoading');
     const productsContainer = document.getElementById('productsContainer');
     
     loadingSpinner.style.display = 'block';
     


     try {
         // Simulate API call with timeout
         await new Promise(resolve => setTimeout(resolve, 1500));
         
         // Sample product data (simulating API response)
         products = [
             {
                 id: 1,
                 name: "Classic Denim Jacket",
                 price: 89.99,
                 category: "Jackets",
                 description: "A timeless denim jacket perfect for any casual outfit. Made from premium cotton denim with a comfortable fit.",
                //  icon: "fas fa-tshirt",
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkNR4pDHRePHd4jl6j2Id70LOdu14S1iGGGQ&s",
                 rating: 4.5,
                 inStock: true
             },
             {
                 id: 2,
                 name: "Elegant Evening Dress",
                 price: 149.99,
                 category: "Dresses",
                 description: "Stunning evening dress perfect for special occasions. Features elegant design and premium fabric.",
                //  icon: "fas fa-female",
                image: "https://dy9ihb9itgy3g.cloudfront.net/products/11875/251e4201/251e4201__d_f__b2_.740.webp",
                 rating: 4.8,
                 inStock: true
             },
             {
                 id: 3,
                 name: "Comfortable Sneakers",
                 price: 79.99,
                 category: "Shoes",
                 description: "Ultra-comfortable sneakers for everyday wear. Breathable material and cushioned sole.",
                //  icon: "fas fa-shoe-prints",
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6hTNnpanqVCgPl68u_Y76soUxGQXMeRZtlA&s",
                 rating: 4.3,
                 inStock: true
             },
             {
                 id: 4,
                 name: "Stylish Handbag",
                 price: 119.99,
                 category: "Accessories",
                 description: "Fashionable handbag with multiple compartments. Perfect for work or casual outings.",
                //  icon: "fas fa-shopping-bag",
                image: "https://image.made-in-china.com/202f0j00BeMUEzYJZvbq/Stylish-Cloud-Women-Shoulder-Bags-PU-Leather-Shoulderbag-Women-Handbag-Fashion.jpg",
                 rating: 4.6,
                 inStock: false
             },
             {
                 id: 5,
                 name: "Cozy Winter Sweater",
                 price: 69.99,
                 category: "Sweaters",
                 description: "Warm and cozy sweater for cold days. Soft wool blend with modern design.",
                //  icon: "fas fa-tshirt",
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQutI5YlSpuIr4Xh4Zj6QFxfj1Y2hIU8_aHbK6UVonLbdhzoD-Ob8xgb-sYN6YAghW1LcQ&usqp=CAU",
                 rating: 4.4,
                 inStock: true
             },
             {
                 id: 6,
                 name: "Designer Sunglasses",
                 price: 199.99,
                 category: "Accessories",
                 description: "Premium designer sunglasses with UV protection. Stylish frames and crystal-clear lenses.",
                //  icon: "fas fa-glasses",
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQt5Z4arQSgwRlTMuzbI3P1Rivm7MsbLgoivQ&s",
                 rating: 4.7,
                 inStock: true
             }
         ];
         
         displayProducts(products);
         
     } catch (error) {
         productsContainer.innerHTML = `
             <div class="col-12 text-center">
                 <div class="alert alert-danger">
                     <i class="fas fa-exclamation-triangle"></i>
                     Failed to load products. Please try again later.
                 </div>
             </div>
         `;
     } finally {
         loadingSpinner.style.display = 'none';
     }
 }

 function displayProducts(productsToShow) {
     const container = document.getElementById('productsContainer');
     
     container.innerHTML = productsToShow.map(product => `
         <div class="col-lg-4 col-md-6 mb-4">
             <div class="card product-card h-100">
                 <div class="product-image">
                     <img src="${product.image}" alt="${product.name}" style="width: 100%; height: auto;">
                 </div>
                 <div class="card-body d-flex flex-column">
                     <h5 class="card-title">${product.name}</h5>
                     <p class="card-text text-muted flex-grow-1">${product.description.substring(0, 80)}...</p>
                     <div class="mb-2">
                         <div class="d-flex align-items-center mb-1">
                             <div class="text-warning me-2">
                                 ${generateStars(product.rating)}
                             </div>
                             <small class="text-muted">(${product.rating})</small>
                         </div>
                         <span class="badge bg-secondary">${product.category}</span>
                         ${!product.inStock ? '<span class="badge bg-danger ms-1">Out of Stock</span>' : ''}
                     </div>
                     <div class="d-flex justify-content-between align-items-center">
                         <span class="product-price">$${product.price}</span>
                         <div>
                             <button class="btn btn-outline-primary btn-sm me-2" onclick="showProductDetails(${product.id})" tabindex="0">
                                 <i class="fas fa-eye"></i>
                             </button>
                             <button class="btn btn-add-cart btn-sm" onclick="addToCart(${product.id})" 
                                     ${!product.inStock ? 'disabled' : ''} tabindex="0">
                                 <i class="fas fa-cart-plus"></i>
                             </button>
                         </div>
                     </div>
                 </div>
             </div>
         </div>
     `).join('');
 }

 function generateStars(rating) {
     const fullStars = Math.floor(rating);
     const hasHalfStar = rating % 1 !== 0;
     let stars = '';
     
     for (let i = 0; i < fullStars; i++) {
         stars += '<i class="fas fa-star"></i>';
     }
     
     if (hasHalfStar) {
         stars += '<i class="fas fa-star-half-alt"></i>';
     }
     
     const emptyStars = 5 - Math.ceil(rating);
     for (let i = 0; i < emptyStars; i++) {
         stars += '<i class="far fa-star"></i>';
     }
     
     return stars;
 }

 function showProductDetails(productId) {
     const product = products.find(p => p.id === productId);
     if (!product) return;
     
     document.getElementById('productModalTitle').textContent = product.name;
     document.getElementById('productModalImage').innerHTML = `<i class="${product.icon}"></i>`;
     document.getElementById('productModalDetails').innerHTML = `
         <h4 class="product-price mb-3">$${product.price}</h4>
         <div class="mb-3">
             <div class="text-warning mb-2">
                 ${generateStars(product.rating)} 
                 <span class="text-muted">(${product.rating}/5)</span>
             </div>
             <span class="badge bg-secondary">${product.category}</span>
             ${!product.inStock ? '<span class="badge bg-danger ms-1">Out of Stock</span>' : '<span class="badge bg-success ms-1">In Stock</span>'}
         </div>
         <p class="mb-4">${product.description}</p>
         <div class="d-grid gap-2">
             <button class="btn btn-primary btn-lg" onclick="addToCart(${product.id}); bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();" 
                     ${!product.inStock ? 'disabled' : ''}>
                 <i class="fas fa-cart-plus"></i> Add to Cart
             </button>
             <button class="btn btn-outline-secondary" onclick="addToWishlist(${product.id})">
                 <i class="fas fa-heart"></i> Add to Wishlist
             </button>
         </div>
     `;
     
     new bootstrap.Modal(document.getElementById('productModal')).show();
 }

 // Shopping Cart Functions
 function addToCart(productId) {
     const product = products.find(p => p.id === productId);
     if (!product || !product.inStock) return;
     
     const existingItem = cart.find(item => item.id === productId);
     
     if (existingItem) {
         existingItem.quantity += 1;
     } else {
         cart.push({
             id: product.id,
             name: product.name,
             price: product.price,
             image: product.image,
             quantity: 1
         });
     }
     
     updateCartDisplay();
     saveCart();
     
     // Show success message
     showNotification(`${product.name} added to cart!`, 'success');
 }

 function removeFromCart(productId) {
     cart = cart.filter(item => item.id !== productId);
     updateCartDisplay();
     saveCart();
 }

 function updateQuantity(productId, change) {
     const item = cart.find(item => item.id === productId);
     if (item) {
         item.quantity += change;
         if (item.quantity <= 0) {
             removeFromCart(productId);
         } else {
             updateCartDisplay();
             saveCart();
         }
     }
 }

 function updateCartDisplay() {
     const cartCount = document.getElementById('cartCount');
     const cartItems = document.getElementById('cartItems');
     const cartTotal = document.getElementById('cartTotal');
     const checkoutBtn = document.getElementById('checkoutBtn');
     
     const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
     const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
     
     cartCount.textContent = totalItems;
     cartTotal.textContent = totalPrice.toFixed(2);
     
     if (cart.length === 0) {
         cartItems.innerHTML = '<p class="text-center text-muted">Your cart is empty</p>';
         checkoutBtn.disabled = true;
     } else {
         cartItems.innerHTML = cart.map(item => `
             <div class="d-flex align-items-center justify-content-between border-bottom py-3">
                 <div class="d-flex align-items-center">
                     <div class="me-3" style="font-size: 2rem; color: var(--text-light);">
                         <i class="${item.icon}"></i>
                     </div>
                     <div>
                         <h6 class="mb-0">${item.name}</h6>
                         <small class="text-muted">$${item.price} each</small>
                     </div>
                 </div>
                 <div class="d-flex align-items-center">
                     <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${item.id}, -1)">-</button>
                     <span class="mx-3">${item.quantity}</span>
                     <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${item.id}, 1)">+</button>
                     <button class="btn btn-sm btn-outline-danger ms-3" onclick="removeFromCart(${item.id})">
                         <i class="fas fa-trash"></i>
                     </button>
                 </div>
             </div>
         `).join('');
         checkoutBtn.disabled = false;
     }
 }

 function toggleCart() {
     new bootstrap.Modal(document.getElementById('cartModal')).show();
 }

 function saveCart() {
     localStorage.setItem('cart', JSON.stringify(cart));
 }

 function checkout() {
     if (cart.length === 0) return;
     
     if (!currentUser) {
         showNotification('Please login to checkout', 'warning');
         showPage('login');
         return;
     }
     
     // Simulate checkout process
     showNotification('Order placed successfully! Thank you for shopping with us.', 'success');
     cart = [];
     updateCartDisplay();
     saveCart();
     bootstrap.Modal.getInstance(document.getElementById('cartModal')).hide();
 }

 // Authentication Functions
 function checkLoginStatus() {
     if (currentUser) {
         document.getElementById('loginNav').style.display = 'none';
         document.getElementById('userNav').style.display = 'block';
         document.getElementById('dashboardNav').style.display = 'block';
         document.getElementById('userName').textContent = currentUser.username;
     } else {
         document.getElementById('loginNav').style.display = 'block';
         document.getElementById('userNav').style.display = 'none';
         document.getElementById('dashboardNav').style.display = 'none';
     }
 }

 function showRegisterForm() {
     document.getElementById('loginPage').style.display = 'none';
     document.getElementById('registerForm').style.display = 'block';
 }

 function showLoginForm() {
     document.getElementById('registerForm').style.display = 'none';
     document.getElementById('loginPage').style.display = 'block';
 }

 function logout() {
     currentUser = null;
     sessionStorage.removeItem('currentUser');
     checkLoginStatus();
     showPage('home');
     showNotification('Logged out successfully', 'info');
 }

 // Form Validation
 function setupFormValidation() {
     // Login Form
     document.getElementById('loginForm').addEventListener('submit', function(e) {
         e.preventDefault();
         
         const username = document.getElementById('loginUsername').value.trim();
         const password = document.getElementById('loginPassword').value.trim();
         
         let isValid = true;
         
         if (!username) {
             showError('loginUsernameError', 'Please enter your username');
             isValid = false;
         } else {
             hideError('loginUsernameError');
         }
         
         if (!password) {
             showError('loginPasswordError', 'Please enter your password');
             isValid = false;
         } else {
             hideError('loginPasswordError');
         }
         
         if (isValid) {
             // Simulate login (accept any username/password)
             currentUser = {
                 username: username,
                 email: username + '@example.com',
                 loginTime: new Date().toISOString()
             };
             
             sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
             checkLoginStatus();
             showPage('dashboard');
             showNotification(`Welcome back, ${username}!`, 'success');
         }
     });
     
     // Registration Form
     document.getElementById('registrationForm').addEventListener('submit', function(e) {
         e.preventDefault();
         
         const fullName = document.getElementById('regFullName').value.trim();
         const email = document.getElementById('regEmail').value.trim();
         const username = document.getElementById('regUsername').value.trim();
         const password = document.getElementById('regPassword').value;
         const confirmPassword = document.getElementById('regConfirmPassword').value;
         const agreeTerms = document.getElementById('agreeTerms').checked;
         
         let isValid = true;
         
         if (!fullName) {
             showError('regFullNameError', 'Please enter your full name');
             isValid = false;
         } else {
             hideError('regFullNameError');
         }
         
         if (!email || !isValidEmail(email)) {
             showError('regEmailError', 'Please enter a valid email address');
             isValid = false;
         } else {
             hideError('regEmailError');
         }
         
         if (!username || username.length < 3) {
             showError('regUsernameError', 'Username must be at least 3 characters');
             isValid = false;
         } else {
             hideError('regUsernameError');
         }
         
         if (!password || password.length < 6) {
             showError('regPasswordError', 'Password must be at least 6 characters');
             isValid = false;
         } else {
             hideError('regPasswordError');
         }
         
         if (password !== confirmPassword) {
             showError('regConfirmPasswordError', 'Passwords do not match');
             isValid = false;
         } else {
             hideError('regConfirmPasswordError');
         }
         
         if (!agreeTerms) {
             showError('agreeTermsError', 'Please agree to the terms');
             isValid = false;
         } else {
             hideError('agreeTermsError');
         }
         
         if (isValid) {
             currentUser = {
                 username: username,
                 email: email,
                 fullName: fullName,
                 loginTime: new Date().toISOString()
             };
             
             sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
             checkLoginStatus();
             showPage('dashboard');
             showNotification(`Account created successfully! Welcome, ${username}!`, 'success');
         }
     });
     
     // Contact Form
     document.getElementById('contactForm').addEventListener('submit', function(e) {
         e.preventDefault();
         
         const name = document.getElementById('contactName').value.trim();
         const email = document.getElementById('contactEmail').value.trim();
         const subject = document.getElementById('contactSubject').value;
         const message = document.getElementById('contactMessage').value.trim();
         
         let isValid = true;
         
         if (!name) {
             showError('contactNameError', 'Please enter your full name');
             isValid = false;
         } else {
             hideError('contactNameError');
         }
         
         if (!email || !isValidEmail(email)) {
             showError('contactEmailError', 'Please enter a valid email address');
             isValid = false;
         } else {
             hideError('contactEmailError');
         }
         
         if (!subject) {
             showError('contactSubjectError', 'Please select a subject');
             isValid = false;
         } else {
             hideError('contactSubjectError');
         }
         
         if (!message) {
             showError('contactMessageError', 'Please enter your message');
             isValid = false;
         } else {
             hideError('contactMessageError');
         }
         
         if (isValid) {
             showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
             this.reset();
         }
     });
 }

 function showError(elementId, message) {
     const errorElement = document.getElementById(elementId);
     errorElement.textContent = message;
     errorElement.style.display = 'block';
 }

 function hideError(elementId) {
     document.getElementById(elementId).style.display = 'none';
 }

 function isValidEmail(email) {
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     return emailRegex.test(email);
 }

 // Dashboard Functions
 function updateDashboard() {
     if (!currentUser) return;
     
     document.getElementById('dashboardUserName').textContent = currentUser.fullName || currentUser.username;
     
     // Load recent orders (simulated data)
     const recentOrders = [
         { id: 'ORD-001', date: '2024-01-15', items: 3, total: 249.97, status: 'Delivered' },
         { id: 'ORD-002', date: '2024-01-10', items: 1, total: 89.99, status: 'Shipped' },
         { id: 'ORD-003', date: '2024-01-05', items: 2, total: 159.98, status: 'Processing' }
     ];
     
     const tableBody = document.getElementById('recentOrdersTable');
     tableBody.innerHTML = recentOrders.map(order => `
         <tr>
             <td><strong>${order.id}</strong></td>
             <td>${order.date}</td>
             <td>${order.items}</td>
             <td>$${order.total}</td>
             <td>
                 <span class="badge ${getStatusBadgeClass(order.status)}">${order.status}</span>
             </td>
         </tr>
     `).join('');
 }

 function getStatusBadgeClass(status) {
     switch (status) {
         case 'Delivered': return 'bg-success';
         case 'Shipped': return 'bg-info';
         case 'Processing': return 'bg-warning';
         default: return 'bg-secondary';
     }
 }

 // Utility Functions
 function showNotification(message, type = 'info') {
     // Create notification element
     const notification = document.createElement('div');
     notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
     notification.style.cssText = 'top: 100px; right: 20px; z-index: 9999; min-width: 300px;';
     notification.innerHTML = `
         ${message}
         <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
     `;
     
     document.body.appendChild(notification);
     
     // Auto remove after 5 seconds
     setTimeout(() => {
         if (notification.parentNode) {
             notification.remove();
         }
     }, 5000);
 }

 function subscribeNewsletter() {
     const email = document.getElementById('newsletterEmail').value.trim();
     
     if (!email || !isValidEmail(email)) {
         showNotification('Please enter a valid email address', 'warning');
         return;
     }
     
     showNotification('Thank you for subscribing to our newsletter!', 'success');
     document.getElementById('newsletterEmail').value = '';
 }

 function addToWishlist(productId) {
     const product = products.find(p => p.id === productId);
     if (product) {
         showNotification(`${product.name} added to wishlist!`, 'success');
     }
 }

 // Dashboard Quick Actions
 function updateProfile() {
     showNotification('Profile update feature coming soon!', 'info');
 }

 function viewWishlist() {
     showNotification('Wishlist feature coming soon!', 'info');
 }

 function trackOrder() {
     showNotification('Order tracking feature coming soon!', 'info');
 }

 // Keyboard Navigation Support
 document.addEventListener('keydown', function(e) {
     // ESC key to close modals
     if (e.key === 'Escape') {
         const modals = document.querySelectorAll('.modal.show');
         modals.forEach(modal => {
             bootstrap.Modal.getInstance(modal)?.hide();
         });
     }
 });

 // Accessibility: Skip to main content
 function skipToMain() {
     document.querySelector('main').focus();
 }

 (function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'9810554754d6292a',t:'MTc1ODE5MzE1OC4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();