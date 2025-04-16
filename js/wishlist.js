document.addEventListener('DOMContentLoaded', function() {
    const wishlistItems = document.querySelector('.wishlist-items');
    const wishlistContainer = document.querySelector('.wishlist-container');
    const emptyWishlist = document.querySelector('.empty-wishlist');
    
    // Get wishlist items from localStorage
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    // Update wishlist display
    function updateWishlistDisplay() {
        if (wishlist.length === 0) {
            wishlistContainer.style.display = 'none';
            emptyWishlist.classList.add('visible');
            return;
        }

        wishlistContainer.style.display = 'block';
        emptyWishlist.classList.remove('visible');
        
        // Clear current wishlist items
        wishlistItems.innerHTML = '';
        
        // Add each item to the wishlist
        wishlist.forEach((item, index) => {
            const wishlistItem = document.createElement('div');
            wishlistItem.className = 'wishlist-item animate__animated animate__fadeIn';
            wishlistItem.style.animationDelay = `${index * 0.1}s`;
            
            wishlistItem.innerHTML = `
                <div class="wishlist-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="wishlist-item-content">
                    <h3>${item.name}</h3>
                    <div class="wishlist-item-price">${item.price}</div>
                    <div class="wishlist-item-actions">
                        <button class="add-to-cart-btn">Add to Cart</button>
                        <button class="remove-from-wishlist">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            
            wishlistItems.appendChild(wishlistItem);
            
            // Add event listeners
            const addToCartBtn = wishlistItem.querySelector('.add-to-cart-btn');
            const removeBtn = wishlistItem.querySelector('.remove-from-wishlist');
            
            addToCartBtn.addEventListener('click', () => {
                // Add to cart
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                cart.push(item);
                localStorage.setItem('cart', JSON.stringify(cart));
                
                // Show success message
                showMessage(`${item.name} added to cart!`, 'success');
            });
            
            removeBtn.addEventListener('click', () => {
                wishlistItem.classList.add('animate__fadeOut');
                setTimeout(() => {
                    wishlist.splice(index, 1);
                    localStorage.setItem('wishlist', JSON.stringify(wishlist));
                    updateWishlistDisplay();
                }, 500);
            });
        });
    }
    
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
            backgroundColor: type === 'success' ? '#2ecc71' : '#e74c3c',
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
    
    // Initialize wishlist display
    updateWishlistDisplay();

    // Search functionality
    const searchToggle = document.querySelector('.search-toggle');
    const searchOverlay = document.querySelector('.search-overlay');
    const searchInput = document.querySelector('.search-input');
    const closeSearch = document.querySelector('.close-search');
    const searchResults = document.querySelector('.search-results');

    // Toggle search overlay
    searchToggle.addEventListener('click', (e) => {
        e.preventDefault();
        searchOverlay.classList.add('active');
        searchInput.focus();
    });

    closeSearch.addEventListener('click', () => {
        searchOverlay.classList.remove('active');
        searchInput.value = '';
        searchResults.innerHTML = '';
    });

    // Close search on overlay click
    searchOverlay.addEventListener('click', (e) => {
        if (e.target === searchOverlay) {
            searchOverlay.classList.remove('active');
        }
    });

    // Search functionality
    let products = [
        { name: 'Pumpernickel', price: '$3.0', category: 'bread', image: 'images/pumpernickel.webp' },
        { name: 'Pretzel', price: '$7.2', category: 'bread', image: 'images/pretzels.webp' },
        { name: 'Croissant', price: '$3.5', category: 'pastries', image: 'images/Croissant.webp' },
        { name: 'Danish', price: '$4.5', category: 'pastries', image: 'images/Danish.webp' },
        { name: 'Chocolate Cake', price: '$20.0', category: 'cakes', image: 'images/Chocolate Cake.webp' },
        { name: 'Cheesecake', price: '$18.0', category: 'cakes', image: 'images/Cheesecake.jpg' },
        { name: 'Baguette', price: '$3.0', category: 'bread', image: 'images/Baguette.jpg' },
        { name: 'Whole Wheat', price: '$3.0', category: 'bread', image: 'images/Whole Wheat.jpg' }
    ];

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        
        if (searchTerm.length < 2) {
            searchResults.style.display = 'none';
            return;
        }

        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );

        displaySearchResults(filteredProducts);
    });

    function displaySearchResults(results) {
        searchResults.innerHTML = '';
        
        if (results.length === 0) {
            searchResults.innerHTML = `
                <div class="search-result-item">
                    <p>No products found</p>
                </div>
            `;
        } else {
            results.forEach(product => {
                const resultItem = document.createElement('div');
                resultItem.className = 'search-result-item';
                resultItem.innerHTML = `
                    <div class="search-result-image">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="search-result-details">
                        <h3>${product.name}</h3>
                        <p>${product.price}</p>
                    </div>
                `;
                
                resultItem.addEventListener('click', () => {
                    window.location.href = `shop.html#${product.name.toLowerCase().replace(' ', '-')}`;
                });
                
                searchResults.appendChild(resultItem);
            });
        }
        
        searchResults.style.display = 'block';
    }
}); 