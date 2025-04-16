document.addEventListener('DOMContentLoaded', function() {
    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productItems = document.querySelectorAll('.product-item');
    const productGrid = document.querySelector('.product-grid');

    // Add wishlist button to each product
    productItems.forEach(item => {
        const productImage = item.querySelector('.product-image');
        const wishlistBtn = document.createElement('button');
        wishlistBtn.className = 'wishlist-btn';
        wishlistBtn.innerHTML = '<i class="fas fa-heart"></i>';
        productImage.appendChild(wishlistBtn);

        // Check if item is in wishlist
        const productName = item.querySelector('h3').textContent;
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        if (wishlist.some(item => item.name === productName)) {
            wishlistBtn.classList.add('active');
        }
    });

    // Add click event listeners to filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const category = this.getAttribute('data-filter');
            
            // Hide all products first
            productItems.forEach(item => {
                item.style.display = 'none';
                item.classList.remove('animate__fadeInUp');
            });

            // Show products of selected category with animation
            if (category === 'all') {
                productItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.display = 'block';
                        item.classList.add('animate__fadeInUp');
                    }, index * 100);
                });
            } else {
                productItems.forEach((item, index) => {
                    if (item.getAttribute('data-category') === category) {
                        setTimeout(() => {
                            item.style.display = 'block';
                            item.classList.add('animate__fadeInUp');
                        }, index * 100);
                    }
                });
            }
        });
    });

    // Add to cart functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productItem = button.closest('.product-item');
            const productName = productItem.querySelector('h3').textContent;
            const productPrice = productItem.querySelector('.price span:last-child').textContent;
            const productImage = productItem.querySelector('img').src;

            const product = {
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            };

            cart.push(product);
            localStorage.setItem('cart', JSON.stringify(cart));

            // Show success message with animation
            showMessage(`${productName} (${productPrice}) added to cart!`, 'success');
            
            // Add a pulse animation to the button
            button.classList.add('animate__animated', 'animate__pulse');
            setTimeout(() => {
                button.classList.remove('animate__animated', 'animate__pulse');
            }, 1000);
        });
    });

    // Wishlist functionality
    const wishlistButtons = document.querySelectorAll('.wishlist-btn');
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    // Initialize wishlist buttons state
    wishlistButtons.forEach(button => {
        const productItem = button.closest('.product-item');
        const productName = productItem.querySelector('h3').textContent;
        
        if (wishlist.some(item => item.name === productName)) {
            button.classList.add('active');
        }
    });

    wishlistButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productItem = button.closest('.product-item');
            const productName = productItem.querySelector('h3').textContent;
            const productPrice = productItem.querySelector('.price span:last-child').textContent;
            const productImage = productItem.querySelector('img').src;

            const product = {
                name: productName,
                price: productPrice,
                image: productImage
            };

            const index = wishlist.findIndex(item => item.name === productName);

            if (index === -1) {
                // Add to wishlist
                wishlist.push(product);
                button.classList.add('active');
                showMessage(`${productName} added to wishlist!`, 'success');
            } else {
                // Remove from wishlist
                wishlist.splice(index, 1);
                button.classList.remove('active');
                showMessage(`${productName} removed from wishlist!`, 'info');
            }

            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            updateWishlistCount();
        });
    });

    // Update wishlist count
    function updateWishlistCount() {
        const wishlistCount = document.querySelector('.wishlist-count') || createWishlistCount();
        const count = wishlist.length;
        wishlistCount.textContent = count;
        wishlistCount.style.display = count > 0 ? 'flex' : 'none';
    }

    function createWishlistCount() {
        const wishlistIcon = document.querySelector('a[href="wishlist.html"]');
        const countElement = document.createElement('span');
        countElement.className = 'wishlist-count';
        wishlistIcon.appendChild(countElement);
        return countElement;
    }

    // Initialize wishlist count
    updateWishlistCount();
    
    // Show message function
    function showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        
        // Style the message
        Object.assign(messageDiv.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 25px',
            borderRadius: '5px',
            color: 'white',
            backgroundColor: type === 'success' ? '#2ecc71' : '#e67e22',
            zIndex: '1000',
            animation: 'slideIn 0.5s ease forwards'
        });
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.style.animation = 'slideOut 0.5s ease forwards';
            setTimeout(() => {
                document.body.removeChild(messageDiv);
            }, 500);
        }, 3000);
    }

    // Search functionality
    const searchToggle = document.querySelector('.search-toggle');
    const searchOverlay = document.querySelector('.search-overlay');
    const searchInput = document.querySelector('.search-input');
    const closeSearch = document.querySelector('.close-search');
    const searchResults = document.querySelector('.search-results');
    let searchTimeout;

    // Open search overlay
    searchToggle.addEventListener('click', function(e) {
        e.preventDefault();
        searchOverlay.classList.add('active');
        searchInput.focus();
        document.body.style.overflow = 'hidden';
    });

    // Close search overlay
    closeSearch.addEventListener('click', function() {
        closeSearchOverlay();
    });

    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
            closeSearchOverlay();
        }
    });

    // Close if clicked outside search container
    searchOverlay.addEventListener('click', function(e) {
        if (e.target === searchOverlay) {
            closeSearchOverlay();
        }
    });

    function closeSearchOverlay() {
        searchOverlay.classList.remove('active');
        searchInput.value = '';
        searchResults.innerHTML = '';
        document.body.style.overflow = '';
    }

    // Handle search input
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        const query = this.value.trim().toLowerCase();
        
        if (query.length === 0) {
            searchResults.innerHTML = '';
            searchResults.classList.remove('active');
            return;
        }

        // Show loading state
        searchResults.innerHTML = '<div class="search-loading"><i class="fas fa-spinner"></i></div>';
        searchResults.classList.add('active');

        // Debounce search
        searchTimeout = setTimeout(() => {
            performSearch(query);
        }, 300);
    });

    function performSearch(query) {
        // Get all product items
        const products = document.querySelectorAll('.product-item');
        const results = [];

        products.forEach(product => {
            const title = product.querySelector('h3').textContent.toLowerCase();
            const price = product.querySelector('.price span:last-child').textContent;
            const image = product.querySelector('img').src;
            const category = product.dataset.category;

            if (title.includes(query)) {
                results.push({
                    title,
                    price,
                    image,
                    category,
                    element: product
                });
            }
        });

        displaySearchResults(results, query);
    }

    function displaySearchResults(results, query) {
        if (results.length === 0) {
            searchResults.innerHTML = '<div class="no-results">No products found</div>';
            return;
        }

        const resultsHtml = results.map(result => {
            const highlightedTitle = result.title.replace(
                new RegExp(query, 'gi'),
                match => `<span class="highlight">${match}</span>`
            );

            return `
                <div class="search-result-item" data-category="${result.category}">
                    <div class="search-result-image">
                        <img src="${result.image}" alt="${result.title}">
                    </div>
                    <div class="search-result-details">
                        <h3>${highlightedTitle}</h3>
                        <p>${result.price}</p>
                    </div>
                </div>
            `;
        }).join('');

        searchResults.innerHTML = resultsHtml;

        // Add click handlers to search results
        document.querySelectorAll('.search-result-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                const product = results[index].element;
                closeSearchOverlay();
                
                // Scroll to the product with a smooth animation
                product.scrollIntoView({ behavior: 'smooth' });
                
                // Highlight the product briefly
                product.style.animation = 'highlight-product 1s ease';
                setTimeout(() => {
                    product.style.animation = '';
                }, 1000);
            });
        });
    }

    // Add hover effects to product items
    productItems.forEach(item => {
        const productImage = item.querySelector('.product-image');
        
        item.addEventListener('mouseenter', () => {
            // Add a subtle lift effect
            item.style.transform = 'translateY(-10px)';
            item.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.15)';
            
            // Add a zoom effect to the image
            if (productImage) {
                productImage.style.transform = 'scale(1.05)';
            }
        });
        
        item.addEventListener('mouseleave', () => {
            // Reset styles
            item.style.transform = 'translateY(0)';
            item.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
            
            if (productImage) {
                productImage.style.transform = 'scale(1)';
            }
        });
    });
});

// Add highlight animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes highlight-product {
        0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(230, 126, 34, 0.4); }
        50% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(230, 126, 34, 0); }
        100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(230, 126, 34, 0); }
    }
`;
document.head.appendChild(style);
