// FlipCard Store - Main JavaScript

// Global State
let state = {
    currentPage: 'home',
    user: null,
    cart: [],
    wishlist: [],
    products: [],
    filteredProducts: [],
    currentCategory: 'All',
    currentSort: 'default',
    viewMode: 'grid',
    searchQuery: '',
    currentPageNum: 1,
    itemsPerPage: 12,
    theme: 'dark',
    quickViewProduct: null
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    initializeProducts();
    initializeCategories();
    initializeTheme();
    initializeEventListeners();
    renderHomePage();
    updateAuthUI();
    updateCartUI();
    updateWishlistUI();
});

// Load State from LocalStorage
function loadState() {
    const savedUser = localStorage.getItem('flipcard_user');
    const savedCart = localStorage.getItem('flipcard_cart');
    const savedWishlist = localStorage.getItem('flipcard_wishlist');
    const savedTheme = localStorage.getItem('flipcard_theme');
    
    if (savedUser) state.user = JSON.parse(savedUser);
    if (savedCart) state.cart = JSON.parse(savedCart);
    if (savedWishlist) state.wishlist = JSON.parse(savedWishlist);
    if (savedTheme) state.theme = savedTheme;
}

// Save State to LocalStorage
function saveState() {
    localStorage.setItem('flipcard_user', JSON.stringify(state.user));
    localStorage.setItem('flipcard_cart', JSON.stringify(state.cart));
    localStorage.setItem('flipcard_wishlist', JSON.stringify(state.wishlist));
    localStorage.setItem('flipcard_theme', state.theme);
}

// Initialize Products
function initializeProducts() {
    state.products = products;
    state.filteredProducts = [...products];
}

// Initialize Categories
function initializeCategories() {
    const categoryMenu = document.getElementById('categoryMenu');
    const categoryFilters = document.getElementById('categoryFilters');
    const homeCategoriesGrid = document.getElementById('homeCategoriesGrid');
    
    if (categoryMenu) {
        categoryMenu.innerHTML = categories.map(cat => 
            `<button class="category-option" onclick="selectCategory('${cat}')">${cat}</button>`
        ).join('');
    }
    
    if (categoryFilters) {
        categoryFilters.innerHTML = categories.map(cat => 
            cat !== 'All' ? `<label class="filter-option">
                <input type="checkbox" value="${cat}" onchange="applyFilters()">
                <span>${cat}</span>
            </label>` : ''
        ).join('');
    }
    
    if (homeCategoriesGrid) {
        const categoryIcons = {
            'Electronics': '📱',
            'Fashion': '👕',
            'Books': '📚',
            'Home & Kitchen': '🏠',
            'Sports': '⚽',
            'Beauty': '💄',
            'Toys': '🧸',
            'Food': '🍕',
            'Automotive': '🚗',
            'Garden': '🌿'
        };
        
        const homeCategories = categories.filter(c => c !== 'All');
        homeCategoriesGrid.innerHTML = homeCategories.map(cat => `
            <div class="category-card" onclick="filterByCategory('${cat}')">
                <span class="category-icon">${categoryIcons[cat] || '📦'}</span>
                <h3>${cat}</h3>
                <p>${getProductCountByCategory(cat)} items</p>
            </div>
        `).join('');
    }
}

function getProductCountByCategory(category) {
    return products.filter(p => p.category === category).length;
}

// Initialize Theme
function initializeTheme() {
    document.documentElement.setAttribute('data-theme', state.theme);
    document.getElementById('themeIcon').textContent = state.theme === 'dark' ? '🌙' : '☀️';
}

// Initialize Event Listeners
function initializeEventListeners() {
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.category-dropdown')) {
            document.getElementById('categoryDropdown')?.classList.remove('open');
        }
        if (!e.target.closest('.user-menu')) {
            document.getElementById('userMenu')?.classList.remove('open');
        }
    });
    
    // Close modals on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeCart();
            closeQuickView();
            closeLogoutModal();
        }
    });
}

// Navigation
function navigateTo(page) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    
    // Show target page
    const targetPage = document.getElementById(page + 'Page');
    if (targetPage) {
        targetPage.style.display = '';
        targetPage.classList.add('page');
    }
    
    state.currentPage = page;
    
    // Page-specific rendering
    switch(page) {
        case 'catalog':
            renderCatalog();
            break;
        case 'wishlist':
            renderWishlist();
            break;
        case 'profile':
            renderProfile();
            break;
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
    
    return false;
}

// Theme Toggle
function toggleTheme() {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', state.theme);
    document.getElementById('themeIcon').textContent = state.theme === 'dark' ? '🌙' : '☀️';
    saveState();
}

// Search
function handleSearch(query) {
    state.searchQuery = query;
    const suggestions = document.getElementById('autocompleteSuggestions');
    
    if (query.length > 1) {
        const matches = products.filter(p => 
            p.name.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5);
        
        if (matches.length > 0) {
            suggestions.innerHTML = matches.map(p => `
                <div class="autocomplete-item" onclick="selectProduct(${p.id})">
                    <img src="${p.image}" alt="${p.name}">
                    <div class="autocomplete-item-info">
                        <div class="autocomplete-item-name">${p.name}</div>
                        <div class="autocomplete-item-price">$${p.price}</div>
                    </div>
                </div>
            `).join('');
            suggestions.classList.add('active');
        } else {
            suggestions.classList.remove('active');
        }
    } else {
        suggestions.classList.remove('active');
    }
}

function clearSearch() {
    document.getElementById('searchInput').value = '';
    document.getElementById('autocompleteSuggestions').classList.remove('active');
    state.searchQuery = '';
    applyFilters();
}

function toggleSearch() {
    const searchBar = document.getElementById('searchBar');
    searchBar.classList.toggle('active');
    if (searchBar.classList.contains('active')) {
        document.getElementById('searchInput').focus();
    }
}

function toggleMobileMenu() {
    const btn = document.getElementById('mobileMenuBtn');
    const nav = document.getElementById('mobileNav');
    const header = document.getElementById('mainHeader');
    
    if (nav) {
        if (nav.classList.contains('open')) {
            nav.classList.remove('open');
            btn.classList.remove('active');
            header.classList.remove('mobile-nav-open');
            document.body.style.overflow = '';
        } else {
            nav.classList.add('open');
            nav.innerHTML = `
                <a href="#" class="nav-link ${state.currentPage === 'home' ? 'active' : ''}" onclick="navigateTo('home'); closeMobileMenu();">Home</a>
                <a href="#" class="nav-link ${state.currentPage === 'catalog' ? 'active' : ''}" onclick="navigateTo('catalog'); closeMobileMenu();">Catalog</a>
                <a href="#" class="nav-link ${state.currentPage === 'wishlist' ? 'active' : ''}" onclick="navigateTo('wishlist'); closeMobileMenu();">Wishlist</a>
            `;
            btn.classList.add('active');
            header.classList.add('mobile-nav-open');
            document.body.style.overflow = 'hidden';
        }
    }
}

function closeMobileMenu() {
    const btn = document.getElementById('mobileMenuBtn');
    const nav = document.getElementById('mobileNav');
    const header = document.getElementById('mainHeader');
    
    if (nav && nav.classList.contains('open')) {
        nav.classList.remove('open');
        btn.classList.remove('active');
        header.classList.remove('mobile-nav-open');
        document.body.style.overflow = '';
    }
}

// Category Menu
function toggleCategoryMenu() {
    document.getElementById('categoryDropdown').classList.toggle('open');
}

function selectCategory(category) {
    document.getElementById('categoryDropdown').classList.remove('open');
    filterByCategory(category);
}

function filterByCategory(category) {
    state.currentCategory = category;
    state.currentPageNum = 1;
    navigateTo('catalog');
}

// User Menu
function handleUserClick() {
    document.getElementById('userMenu').classList.toggle('open');
}

function updateAuthUI() {
    const userInfo = document.getElementById('userInfoSection');
    const loginOption = document.getElementById('loginOption');
    const registerOption = document.getElementById('registerOption');
    const profileOption = document.getElementById('profileOption');
    const logoutOption = document.getElementById('logoutOption');
    const userAvatarIcon = document.getElementById('userAvatarIcon');
    
    if (state.user) {
        userInfo.style.display = 'block';
        document.getElementById('userName').textContent = state.user.name;
        document.getElementById('userEmail').textContent = state.user.email;
        loginOption.style.display = 'none';
        registerOption.style.display = 'none';
        profileOption.style.display = 'block';
        logoutOption.style.display = 'block';
        userAvatarIcon.textContent = '👤';
    } else {
        userInfo.style.display = 'none';
        loginOption.style.display = 'block';
        registerOption.style.display = 'block';
        profileOption.style.display = 'none';
        logoutOption.style.display = 'none';
        userAvatarIcon.textContent = '👤';
    }
}

// Authentication
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Clear previous errors
    clearErrors(['loginEmail', 'loginPassword']);
    
    // Validate
    let hasError = false;
    
    if (!validateEmail(email)) {
        showError('loginEmail', 'Please enter a valid email');
        hasError = true;
    }
    
    if (!password) {
        showError('loginPassword', 'Password is required');
        hasError = true;
    }
    
    if (hasError) return;
    
    // Simulate login (in real app, this would be an API call)
    const user = {
        name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
        email: email,
        joinedDate: new Date().toISOString()
    };
    
    state.user = user;
    saveState();
    updateAuthUI();
    
    showToast('Welcome back!', 'success');
    navigateTo('home');
}

function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
    // Clear previous errors
    clearErrors(['registerName', 'registerEmail', 'registerPassword', 'registerConfirmPassword']);
    
    // Validate
    let hasError = false;
    
    if (name.length < 2) {
        showError('registerName', 'Name must be at least 2 characters');
        hasError = true;
    }
    
    if (!validateEmail(email)) {
        showError('registerEmail', 'Please enter a valid email');
        hasError = true;
    }
    
    if (password.length < 6) {
        showError('registerPassword', 'Password must be at least 6 characters');
        hasError = true;
    }
    
    if (password !== confirmPassword) {
        showError('registerConfirmPassword', 'Passwords do not match');
        hasError = true;
    }
    
    if (hasError) return;
    
    // Create user
    const user = {
        name: name,
        email: email,
        joinedDate: new Date().toISOString()
    };
    
    state.user = user;
    saveState();
    updateAuthUI();
    
    showToast('Account created successfully!', 'success');
    navigateTo('home');
}

function handleForgotPassword(e) {
    e.preventDefault();
    
    const email = document.getElementById('forgotEmail').value;
    
    if (!validateEmail(email)) {
        showError('forgotEmail', 'Please enter a valid email');
        return;
    }
    
    showToast('Password reset link sent to your email', 'info');
    navigateTo('login');
}

function checkPasswordStrength(password) {
    const fill = document.getElementById('strengthFill');
    const text = document.getElementById('strengthText');
    
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    fill.className = 'strength-fill';
    if (password.length > 0) {
        if (strength < 3) {
            fill.classList.add('weak');
            text.textContent = 'Weak';
        } else if (strength < 5) {
            fill.classList.add('medium');
            text.textContent = 'Medium';
        } else {
            fill.classList.add('strong');
            text.textContent = 'Strong';
        }
    } else {
        text.textContent = '';
    }
}

function socialLogin(provider) {
    showToast(`Signing in with ${provider}...`, 'info');
    // In real app, this would initiate OAuth flow
    setTimeout(() => {
        state.user = {
            name: 'Social User',
            email: 'social@example.com',
            joinedDate: new Date().toISOString()
        };
        saveState();
        updateAuthUI();
        showToast('Signed in successfully!', 'success');
        navigateTo('home');
    }, 1000);
}

function handleLogout() {
    document.getElementById('userMenu').classList.remove('open');
    document.getElementById('logoutModal').classList.add('open');
}

function closeLogoutModal() {
    document.getElementById('logoutModal').classList.remove('open');
}

function confirmLogout() {
    state.user = null;
    state.cart = [];
    state.wishlist = [];
    localStorage.removeItem('flipcard_user');
    localStorage.removeItem('flipcard_cart');
    localStorage.removeItem('flipcard_wishlist');
    updateAuthUI();
    updateCartUI();
    updateWishlistUI();
    closeLogoutModal();
    showToast('Signed out successfully', 'info');
    navigateTo('home');
}

function updateProfile() {
    const name = document.getElementById('profileNameInput').value;
    const email = document.getElementById('profileEmailInput').value;
    
    if (name && email && state.user) {
        state.user.name = name;
        state.user.email = email;
        saveState();
        updateAuthUI();
        renderProfile();
        showToast('Profile updated successfully', 'success');
    }
}

// Profile Page
function renderProfile() {
    if (state.user) {
        document.getElementById('profileName').textContent = state.user.name;
        document.getElementById('profileEmail').textContent = state.user.email;
        document.getElementById('profileNameInput').value = state.user.name;
        document.getElementById('profileEmailInput').value = state.user.email;
        document.getElementById('profileAvatar').textContent = '👤';
    }
}

// Catalog
function renderCatalog() {
    applyFilters();
}

function applyFilters() {
    let filtered = [...products];
    
    // Category filter
    const categoryCheckboxes = document.querySelectorAll('#categoryFilters input:checked');
    if (categoryCheckboxes.length > 0) {
        const selectedCategories = Array.from(categoryCheckboxes).map(cb => cb.value);
        filtered = filtered.filter(p => selectedCategories.includes(p.category));
    } else if (state.currentCategory !== 'All') {
        filtered = filtered.filter(p => p.category === state.currentCategory);
    }
    
    // Search filter
    if (state.searchQuery) {
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(state.searchQuery.toLowerCase())
        );
    }
    
    // Price filter
    const minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
    const maxPrice = parseFloat(document.getElementById('maxPrice').value) || Infinity;
    filtered = filtered.filter(p => p.price >= minPrice && p.price <= maxPrice);
    
    // Rating filter
    const ratingCheckboxes = document.querySelectorAll('#ratingFilters input:checked');
    if (ratingCheckboxes.length > 0) {
        const minRating = Math.min(...Array.from(ratingCheckboxes).map(cb => parseFloat(cb.value)));
        filtered = filtered.filter(p => p.rating >= minRating);
    }
    
    // Stock filter
    if (document.getElementById('inStockFilter').checked) {
        filtered = filtered.filter(p => p.stock > 0);
    }
    
    // Sort
    applySort(filtered);
}

function applySort(productList) {
    switch(state.currentSort) {
        case 'price-low':
            productList.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            productList.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            productList.sort((a, b) => b.rating - a.rating);
            break;
        case 'newest':
            productList.sort((a, b) => b.id - a.id);
            break;
        case 'name':
            productList.sort((a, b) => a.name.localeCompare(b.name));
            break;
    }
    
    state.filteredProducts = productList;
    renderProducts();
}

function handleSort(value) {
    state.currentSort = value;
    applyFilters();
}

function setViewMode(mode) {
    state.viewMode = mode;
    document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
    event.target.closest('.view-btn').classList.add('active');
    renderProducts();
}

function applyPriceFilter() {
    applyFilters();
}

function clearFilters() {
    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';
    document.querySelectorAll('#categoryFilters input').forEach(cb => cb.checked = false);
    document.querySelectorAll('#ratingFilters input').forEach(cb => cb.checked = false);
    document.getElementById('inStockFilter').checked = false;
    state.currentCategory = 'All';
    state.searchQuery = '';
    document.getElementById('searchInput').value = '';
    state.currentSort = 'default';
    document.getElementById('sortSelect').value = 'default';
    applyFilters();
}

function renderProducts() {
    const grid = document.getElementById('productsGrid');
    const countEl = document.getElementById('productCount');
    
    // Pagination
    const totalPages = Math.ceil(state.filteredProducts.length / state.itemsPerPage);
    const startIdx = (state.currentPageNum - 1) * state.itemsPerPage;
    const pageProducts = state.filteredProducts.slice(startIdx, startIdx + state.itemsPerPage);
    
    countEl.textContent = `Showing ${pageProducts.length} of ${state.filteredProducts.length} products`;
    
    if (pageProducts.length === 0) {
        grid.innerHTML = '<p class="empty-message">No products found</p>';
        document.getElementById('pagination').innerHTML = '';
        return;
    }
    
    grid.className = `products-grid ${state.viewMode === 'list' ? 'list-view' : ''}`;
    
    grid.innerHTML = pageProducts.map((product, idx) => `
        <div class="product-card" style="animation-delay: ${idx * 50}ms">
            <div class="product-card-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                ${product.tag ? `<span class="product-badge ${product.tag}">${product.tag}</span>` : ''}
                <button class="wishlist-btn ${state.wishlist.includes(product.id) ? 'active' : ''}" onclick="toggleWishlist(${product.id})">
                    ${state.wishlist.includes(product.id) ? '♥' : '♡'}
                </button>
                <button class="quick-view-btn" onclick="openQuickView(${product.id})">Quick View</button>
            </div>
            <div class="product-card-content">
                <span class="product-category">${product.category}</span>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-rating">
                    <span class="stars">${getStars(product.rating)}</span>
                    <span class="count">(${product.reviews})</span>
                </div>
                <div class="product-price">
                    <span class="current-price">$${product.price}</span>
                    ${product.originalPrice ? `<span class="original-price">$${product.originalPrice}</span>` : ''}
                </div>
                <span class="product-stock ${getStockClass(product.stock)}">${getStockText(product.stock)}</span>
                <div class="product-actions">
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
                    <button class="add-to-wishlist-btn ${state.wishlist.includes(product.id) ? 'active' : ''}" onclick="toggleWishlist(${product.id})">
                        ${state.wishlist.includes(product.id) ? '♥' : '♡'}
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    const pagination = document.getElementById('pagination');
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let html = '';
    
    // Previous button
    html += `<button class="pagination-btn" onclick="changePage(${state.currentPageNum - 1})" ${state.currentPageNum === 1 ? 'disabled' : ''}>‹</button>`;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= state.currentPageNum - 1 && i <= state.currentPageNum + 1)) {
            html += `<button class="pagination-btn ${i === state.currentPageNum ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
        } else if (i === state.currentPageNum - 2 || i === state.currentPageNum + 2) {
            html += '<span class="pagination-dots">...</span>';
        }
    }
    
    // Next button
    html += `<button class="pagination-btn" onclick="changePage(${state.currentPageNum + 1})" ${state.currentPageNum === totalPages ? 'disabled' : ''}>›</button>`;
    
    pagination.innerHTML = html;
}

function changePage(page) {
    state.currentPageNum = page;
    renderProducts();
    window.scrollTo(0, 200);
}

// Product Helpers
function getStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

function getStockClass(stock) {
    if (stock === 0) return 'out-of-stock';
    if (stock < 10) return 'low-stock';
    return 'in-stock';
}

function getStockText(stock) {
    if (stock === 0) return 'Out of Stock';
    if (stock < 10) return `Only ${stock} left`;
    return 'In Stock';
}

// Quick View
function openQuickView(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    state.quickViewProduct = product;
    
    document.getElementById('quickViewImage').src = product.image;
    document.getElementById('quickViewBadge').textContent = product.tag || '';
    document.getElementById('quickViewBadge').style.display = product.tag ? 'block' : 'none';
    document.getElementById('quickViewCategory').textContent = product.category;
    document.getElementById('quickViewName').textContent = product.name;
    document.getElementById('quickViewRating').innerHTML = getStars(product.rating) + ` <span class="count">(${product.reviews} reviews)</span>`;
    document.getElementById('quickViewDescription').textContent = product.description;
    document.getElementById('quickViewSpecs').innerHTML = product.specs.map(s => `<span>${s}</span>`).join('');
    document.getElementById('quickViewPrice').textContent = `$${product.price}`;
    document.getElementById('quickViewOriginalPrice').textContent = product.originalPrice ? `$${product.originalPrice}` : '';
    document.getElementById('quickViewOriginalPrice').style.display = product.originalPrice ? 'inline' : 'none';
    document.getElementById('quickViewStock').textContent = getStockText(product.stock);
    document.getElementById('quickViewStock').className = `quick-view-stock ${getStockClass(product.stock)}`;
    
    document.getElementById('quickViewModal').classList.add('open');
}

function closeQuickView() {
    document.getElementById('quickViewModal').classList.remove('open');
    state.quickViewProduct = null;
}

function addToCartFromQuickView() {
    if (state.quickViewProduct) {
        addToCart(state.quickViewProduct.id);
    }
}

function addToWishlistFromQuickView() {
    if (state.quickViewProduct) {
        toggleWishlist(state.quickViewProduct.id);
    }
}

function selectProduct(productId) {
    openQuickView(productId);
    clearSearch();
}

// Cart
function updateCartUI() {
    document.getElementById('cartCount').textContent = state.cart.length;
}

function openCart() {
    document.getElementById('cartModal').classList.add('open');
    document.getElementById('cartOverlay').classList.add('open');
    renderCart();
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    document.getElementById('cartModal').classList.remove('open');
    document.getElementById('cartOverlay').classList.remove('open');
    document.body.style.overflow = '';
}

function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (state.cart.length === 0) {
        cartItems.innerHTML = '<p class="cart-empty">Your cart is empty</p>';
        cartTotal.textContent = '$0.00';
        return;
    }
    
    let total = 0;
    cartItems.innerHTML = state.cart.map((item, idx) => {
        total += item.price;
        return `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price}</div>
                    <div class="cart-item-controls">
                        <button class="qty-btn" onclick="updateCartQty(${idx}, -1)">−</button>
                        <span class="qty-value">1</span>
                        <button class="qty-btn" onclick="updateCartQty(${idx}, 1)">+</button>
                        <button class="cart-item-remove" onclick="removeFromCart(${idx})">🗑️</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    cartTotal.textContent = `$${total.toFixed(2)}`;
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || product.stock === 0) {
        showToast('Product not available', 'error');
        return;
    }
    
    state.cart.push(product);
    saveState();
    updateCartUI();
    showToast(`${product.name} added to cart`, 'success');
}

function removeFromCart(index) {
    const item = state.cart[index];
    state.cart.splice(index, 1);
    saveState();
    updateCartUI();
    renderCart();
    showToast(`${item.name} removed from cart`, 'info');
}

function updateCartQty(index, delta) {
    // Simplified: just re-render (in real app would update quantity)
    renderCart();
}

function proceedToCheckout() {
    if (state.cart.length === 0) {
        showToast('Your cart is empty', 'error');
        return;
    }
    
    if (!state.user) {
        showToast('Please sign in to checkout', 'info');
        closeCart();
        navigateTo('login');
        return;
    }
    
    const total = state.cart.reduce((sum, item) => sum + item.price, 0);
    alert(`Thank you for your order!\n\nTotal: $${total.toFixed(2)}\n\nThis is a demo. In a real app, you would be redirected to payment.`);
    
    state.cart = [];
    saveState();
    updateCartUI();
    closeCart();
    showToast('Order placed successfully!', 'success');
}

// Wishlist
function updateWishlistUI() {
    // Update any wishlist count displays
}

function toggleWishlist(productId) {
    const index = state.wishlist.indexOf(productId);
    
    if (index === -1) {
        state.wishlist.push(productId);
        showToast('Added to wishlist', 'success');
    } else {
        state.wishlist.splice(index, 1);
        showToast('Removed from wishlist', 'info');
    }
    
    saveState();
    
    // Re-render if on wishlist or catalog page
    if (state.currentPage === 'wishlist') {
        renderWishlist();
    } else if (state.currentPage === 'catalog') {
        renderProducts();
    }
}

function renderWishlist() {
    const grid = document.getElementById('wishlistGrid');
    const wishlistProducts = products.filter(p => state.wishlist.includes(p.id));
    
    if (wishlistProducts.length === 0) {
        grid.innerHTML = '<p class="empty-message">Your wishlist is empty</p>';
        return;
    }
    
    grid.innerHTML = wishlistProducts.map(product => `
        <div class="product-card">
            <div class="product-card-image">
                <img src="${product.image}" alt="${product.name}">
                ${product.tag ? `<span class="product-badge ${product.tag}">${product.tag}</span>` : ''}
            </div>
            <div class="product-card-content">
                <span class="product-category">${product.category}</span>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-rating">
                    <span class="stars">${getStars(product.rating)}</span>
                    <span class="count">(${product.reviews})</span>
                </div>
                <div class="product-price">
                    <span class="current-price">$${product.price}</span>
                    ${product.originalPrice ? `<span class="original-price">$${product.originalPrice}</span>` : ''}
                </div>
                <div class="product-actions">
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
                    <button class="add-to-wishlist-btn active" onclick="toggleWishlist(${product.id})">♥</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Toast Notifications
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: '✓',
        error: '✕',
        info: 'ℹ'
    };
    
    toast.innerHTML = `
        <span class="toast-icon">${icons[type]}</span>
        <span class="toast-message">${message}</span>
        <button class="toast-close" onclick="this.parentElement.remove()">✕</button>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 4000);
}

// Form Validation Helpers
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(fieldId, message) {
    document.getElementById(fieldId + 'Error').textContent = message;
}

function clearErrors(fields) {
    fields.forEach(field => {
        document.getElementById(field + 'Error').textContent = '';
    });
}

// Newsletter
function subscribeNewsletter(e) {
    e.preventDefault();
    const email = e.target.querySelector('input').value;
    if (validateEmail(email)) {
        showToast('Thank you for subscribing!', 'success');
        e.target.reset();
    } else {
        showToast('Please enter a valid email', 'error');
    }
}

// Home Page
function renderHomePage() {
    // Already rendered via HTML, just update dynamic content
}

// Initial load helper for products in quick view
function selectProduct(productId) {
    clearSearch();
    navigateTo('catalog');
    setTimeout(() => openQuickView(productId), 100);
}
