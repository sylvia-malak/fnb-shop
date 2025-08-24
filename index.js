// Product search functionality
const setupSearch = () => {
    const searchForms = document.querySelectorAll('.search-bar');
    
    searchForms.forEach(form => {
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            performSearch(this);
        });
        
        
        const searchInput = form.querySelector('input');
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch(form);
            }
        });
    });
    
    
    const performSearch = (form) => {
        const searchInput = form.querySelector('input');
        const searchTerm = searchInput.value.trim();
        
        if (searchTerm !== '') {
            
            if (window.location.pathname.includes('products.html')) {
                filterProductsBySearch(searchTerm);
            } else {
                
                window.location.href = `products.html?search=${encodeURIComponent(searchTerm)}`;
            }
        }
    };
    
    
    const filterProductsBySearch = (searchTerm) => {
        const productCards = document.querySelectorAll('.product-card');
        let foundResults = false;
        const searchLower = searchTerm.toLowerCase();
        
        productCards.forEach(card => {
            const productName = card.querySelector('h3').textContent.toLowerCase();
            const productDesc = card.querySelector('.description').textContent.toLowerCase();
            
            if (productName.includes(searchLower) || productDesc.includes(searchLower)) {
                card.style.display = 'block';
                foundResults = true;
                
                
                card.classList.add('highlight-search');
            } else {
                card.style.display = 'none';
                card.classList.remove('highlight-search');
            }
        });
        
        
        showSearchMessage(foundResults, searchTerm);
    };
    
    
    const showSearchMessage = (foundResults, searchTerm) => {
        
        const existingMessage = document.querySelector('.search-result-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        if (!foundResults) {
            const productsGrid = document.querySelector('.products-grid');
            const message = document.createElement('div');
            message.className = 'search-result-message';
            message.innerHTML = `
                <p>No products found for "<strong>${searchTerm}</strong>".</p>
                <button class="btn-clear-search">Clear Search</button>
            `;
            
            productsGrid.parentNode.insertBefore(message, productsGrid);
            
            
            const clearButton = message.querySelector('.btn-clear-search');
            clearButton.addEventListener('click', clearSearch);
        }
    };
    
    
    const clearSearch = () => {
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            card.style.display = 'block';
            card.classList.remove('highlight-search');
        });
        
        
        const searchInputs = document.querySelectorAll('.search-bar input');
        searchInputs.forEach(input => {
            input.value = '';
        });
        
        
        const searchMessage = document.querySelector('.search-result-message');
        if (searchMessage) {
            searchMessage.remove();
        }
    };
    
    
    const handleSearchFromURL = () => {
        if (window.location.pathname.includes('products.html')) {
            const urlParams = new URLSearchParams(window.location.search);
            const searchParam = urlParams.get('search');
            
            if (searchParam) {
                
                const searchInputs = document.querySelectorAll('.search-bar input');
                searchInputs.forEach(input => {
                    input.value = searchParam;
                });
                
                filterProductsBySearch(searchParam);
            }
        }
    };
    
    
    handleSearchFromURL();
};

// Add to cart functionality
const setupAddToCart = () => {
    const addToCartButtons = document.querySelectorAll('.product-card .btn');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.closest('.product-card').querySelector('h3').textContent;
            const productPrice = this.closest('.product-card').querySelector('.price').textContent;
            
            // Show confirmation message
            alert(`Added to cart: ${productName} - ${productPrice}`);
        });
    });
};


// Contact form handling
const setupContactForm = () => {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // form validation
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            if (name && email && message) {
                alert('Thank you for your message! We will get back to you soon.');
                this.reset();
            } else {
                alert('Please fill in all required fields.');
            }
        });
    }
};


// Filter functionality 
const setupFilters = () => {
    const categoryFilter = document.getElementById('category');
    const sortFilter = document.getElementById('sort');
    const productGrid = document.querySelector('.products-grid');
    const productCards = document.querySelectorAll('.product-card');
    
    if (categoryFilter && sortFilter && productGrid) {
        // Main function to handle both filtering and sorting
        const filterAndSortProducts = () => {
            const selectedCategory = categoryFilter.value;
            const sortOption = sortFilter.value;
            
            // Filter products by category
            productCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (selectedCategory === 'all' || cardCategory === selectedCategory) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Sort products
            const visibleProducts = Array.from(productCards).filter(card => 
                card.style.display !== 'none'
            );
            
            const productsArray = Array.from(visibleProducts);
            
            productsArray.sort((a, b) => {
                const priceA = parseFloat(a.getAttribute('data-price'));
                const priceB = parseFloat(b.getAttribute('data-price'));
                
                switch(sortOption) {
                    case 'price-low':
                        return priceA - priceB;
                    case 'price-high':
                        return priceB - priceA;
                    case 'newest':
                    case 'popular':
                    default:
                        return 0; 
                }
            });
            
            // Reorder products in the grid
            productsArray.forEach(product => {
                productGrid.appendChild(product);
            });
        };

        // Attach events
        categoryFilter.addEventListener('change', filterAndSortProducts);
        sortFilter.addEventListener('change', filterAndSortProducts);
    }
};


// Initialize all functionalities
setupSearch();
setupAddToCart();
setupContactForm();
setupFilters();
