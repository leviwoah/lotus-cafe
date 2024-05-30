document.addEventListener('DOMContentLoaded', () => {
    const cartIcon = document.getElementById('cart-icon');
    const cartContainer = document.getElementById('cart');
    const purchaseBtn = document.querySelector('.btn-purchase');
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    // Initialize cart display
    cartContainer.style.display = 'none';

    function toggleCart() {
        if (cartContainer.style.display === 'none') {
            cartContainer.style.display = 'block';
        } else {
            cartContainer.style.display = 'none';
        }
    }

    function updateCart() {
        const cartItemsContainer = document.querySelector('.cart-items');
        const cartTotalPrice = document.querySelector('.cart-total-price');

        cartItemsContainer.innerHTML = '';
        let total = 0;

        cartItems.forEach(item => {
            const cartItem = document.createElement('li');
            cartItem.classList.add('cart-item');
            const itemPrice = parseFloat(item.price.replace('$', ''));

            cartItem.innerHTML = `
                <img src="${item.imageSrc}" alt="${item.title}">
                <div class="cart-item-details">
                    <span class="cart-item-title">${item.title}</span>
                    <span class="cart-item-price">$${itemPrice.toFixed(2)}</span>
                </div>
                <input class="quantity-input" type="number" value="${item.quantity}" min="1">
                <button class="btn-remove">X</button>
            `;
            cartItemsContainer.appendChild(cartItem);

            total += itemPrice * item.quantity;

            cartItem.querySelector('.btn-remove').addEventListener('click', () => {
                removeCartItem(item);
            });

            cartItem.querySelector('.quantity-input').addEventListener('change', (e) => {
                updateQuantity(item, e.target.value);
            });
        });

        cartTotalPrice.textContent = total.toFixed(2);
    }

    function removeCartItem(item) {
        cartItems = cartItems.filter(cartItem => cartItem !== item);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCart();
    }

    function updateQuantity(item, quantity) {
        item.quantity = parseInt(quantity);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCart();
    }

    function addToCart(item) {
        const existingItem = cartItems.find(cartItem => cartItem.title === item.title);
        if (existingItem) {
            existingItem.quantity += item.quantity;
        } else {
            cartItems.push(item);
        }
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCart();
    }

    function handleClickOutside(event) {
        if (!cartContainer.contains(event.target) && !cartIcon.contains(event.target)) {
            cartContainer.style.display = 'none';
        }
    }

    document.addEventListener('click', handleClickOutside);

    cartIcon.addEventListener('click', (event) => {
        event.stopPropagation();  // Prevent the click from being detected as outside click
        toggleCart();
    });

    purchaseBtn.addEventListener('click', () => {
        alert('Thank you for your purchase!');
        cartItems = [];
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCart();
    });

    updateCart();
});
