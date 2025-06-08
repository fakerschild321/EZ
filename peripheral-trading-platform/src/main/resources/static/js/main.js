/**
 * Main JavaScript functionality for PeriphTrade
 * Handles general site interactions, form validation, and utilities
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality when DOM is loaded
    initializeFormValidation();
    initializeTooltips();
    initializeCartFunctionality();
    initializeSearchFunctionality();
    initializeImageGallery();
    
    // Auto-hide flash messages after 5 seconds
    setTimeout(hideFlashMessages, 5000);
});

/**
 * Initialize Bootstrap form validation
 */
function initializeFormValidation() {
    const forms = document.querySelectorAll('.needs-validation, form[novalidate]');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        });
    });
}

/**
 * Initialize Bootstrap tooltips
 */
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

/**
 * Initialize cart functionality
 */
function initializeCartFunctionality() {
    // Update cart badge when items are added
    updateCartBadge();
    
    // Handle quantity changes in cart
    const quantityInputs = document.querySelectorAll('.cart-quantity');
    quantityInputs.forEach(input => {
        input.addEventListener('change', function() {
            updateCartItemQuantity(this.dataset.productId, this.value);
        });
    });
}

/**
 * Initialize search functionality
 */
function initializeSearchFunctionality() {
    const searchForm = document.querySelector('.d-flex');
    const searchInput = document.querySelector('input[name="search"]');
    
    if (searchInput) {
        // Add search suggestions (would connect to backend in real app)
        searchInput.addEventListener('input', debounce(function(e) {
            if (e.target.value.length > 2) {
                // In a real app, this would fetch search suggestions
                console.log('Searching for:', e.target.value);
            }
        }, 300));
    }
}

/**
 * Initialize image gallery functionality
 */
function initializeImageGallery() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            changeMainImage(this.src);
            
            // Update active thumbnail
            thumbnails.forEach(t => t.classList.remove('border-primary'));
            this.classList.add('border-primary');
        });
    });
}

/**
 * Change main product image
 */
function changeMainImage(src) {
    const mainImage = document.getElementById('mainImage');
    if (mainImage) {
        mainImage.src = src;
        
        // Add loading effect
        mainImage.style.opacity = '0.5';
        setTimeout(() => {
            mainImage.style.opacity = '1';
        }, 200);
    }
}

/**
 * Update cart badge count
 */
function updateCartBadge() {
    const cartBadge = document.querySelector('.navbar-nav .badge');
    if (cartBadge) {
        // In a real app, this would get count from session/API
        const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
        cartBadge.textContent = cartItems.length;
        
        if (cartItems.length === 0) {
            cartBadge.style.display = 'none';
        } else {
            cartBadge.style.display = 'inline';
        }
    }
}

/**
 * Update cart item quantity
 */
function updateCartItemQuantity(productId, quantity) {
    const numQuantity = parseInt(quantity);
    
    if (numQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    // Show loading state
    showLoading();
    
    // In a real app, this would make an API call
    setTimeout(() => {
        hideLoading();
        showToast('Cart updated successfully', 'success');
        
        // Update UI
        const row = document.querySelector(`[data-product-id="${productId}"]`);
        if (row) {
            const price = parseFloat(row.querySelector('.price').textContent.replace('$', ''));
            const subtotal = row.querySelector('.subtotal');
            if (subtotal) {
                subtotal.textContent = `$${(price * numQuantity).toFixed(2)}`;
            }
        }
        
        updateCartTotals();
    }, 500);
}

/**
 * Remove item from cart
 */
function removeFromCart(productId) {
    if (!confirm('Are you sure you want to remove this item from your cart?')) {
        return;
    }
    
    showLoading();
    
    // In a real app, this would make an API call
    setTimeout(() => {
        hideLoading();
        showToast('Item removed from cart', 'info');
        
        // Remove row from UI
        const row = document.querySelector(`[data-product-id="${productId}"]`);
        if (row) {
            row.remove();
        }
        
        updateCartTotals();
        updateCartBadge();
    }, 500);
}

/**
 * Update cart totals
 */
function updateCartTotals() {
    const cartItems = document.querySelectorAll('.cart-item');
    let subtotal = 0;
    
    cartItems.forEach(item => {
        const subtotalElement = item.querySelector('.subtotal');
        if (subtotalElement) {
            const itemSubtotal = parseFloat(subtotalElement.textContent.replace('$', ''));
            subtotal += itemSubtotal;
        }
    });
    
    const tax = subtotal * 0.08;
    const shipping = subtotal >= 50 ? 0 : 5.99;
    const total = subtotal + tax + shipping;
    
    // Update UI
    const subtotalElement = document.getElementById('subtotal');
    const taxElement = document.getElementById('tax');
    const shippingElement = document.getElementById('shipping');
    const totalElement = document.getElementById('total');
    
    if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    if (taxElement) taxElement.textContent = `$${tax.toFixed(2)}`;
    if (shippingElement) {
        shippingElement.innerHTML = subtotal >= 50 ? '<span class="text-success">Free</span>' : '$5.99';
    }
    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
}

/**
 * Show loading state
 */
function showLoading() {
    const existingLoader = document.querySelector('.loading-overlay');
    if (existingLoader) return;
    
    const loader = document.createElement('div');
    loader.className = 'loading-overlay position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center';
    loader.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    loader.style.zIndex = '9999';
    loader.innerHTML = `
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    `;
    
    document.body.appendChild(loader);
}

/**
 * Hide loading state
 */
function hideLoading() {
    const loader = document.querySelector('.loading-overlay');
    if (loader) {
        loader.remove();
    }
}

/**
 * Show toast notification
 */
function showToast(message, type = 'info') {
    const toastContainer = getOrCreateToastContainer();
    
    const toastId = 'toast-' + Date.now();
    const toast = document.createElement('div');
    toast.id = toastId;
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    // Auto-remove after toast hides
    toast.addEventListener('hidden.bs.toast', function() {
        toast.remove();
    });
}

/**
 * Get or create toast container
 */
function getOrCreateToastContainer() {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        container.style.zIndex = '1050';
        document.body.appendChild(container);
    }
    return container;
}

/**
 * Hide flash messages
 */
function hideFlashMessages() {
    const alerts = document.querySelectorAll('.alert-dismissible');
    alerts.forEach(alert => {
        const bsAlert = new bootstrap.Alert(alert);
        bsAlert.close();
    });
}

/**
 * Debounce function to limit function calls
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Format currency
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

/**
 * Format date
 */
function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(date));
}

/**
 * Smooth scroll to element
 */
function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

/**
 * Copy text to clipboard
 */
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard!', 'success');
    }).catch(() => {
        showToast('Failed to copy text', 'danger');
    });
}

/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Generate random ID
 */
function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

/**
 * Check if element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Lazy load images
 */
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Global utility functions
window.PeriphTrade = {
    showLoading,
    hideLoading,
    showToast,
    formatCurrency,
    formatDate,
    scrollToElement,
    copyToClipboard,
    isValidEmail,
    generateId,
    isInViewport,
    debounce
};
