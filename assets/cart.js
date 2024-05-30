document.addEventListener('DOMContentLoaded', ready);

function ready() {
    const cartIcon = document.getElementById('cart-icon');
    const cartPanel = document.getElementById('cart-panel');
    cartIcon.addEventListener('click', toggleCart);

    if (localStorage.getItem('cartItems')) {
        loadCartItems();
    }

    document.querySelector('.btn-checkout').addEventListener('click', checkout);
}

function toggleCart() {
    const cartPanel = document.getElementById('cart-panel');
    cartPanel.classList.toggle('open');
}

function loadCartItems() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartItemsContainer = document.querySelector('.cart-items');
    cartItemsContainer.innerHTML = '';

    cartItems.forEach(item => {
        addItemToCartDOM(item);
    });

    updateCartTotal();
}

function addToCartClicked(event) {
    const button = event.target;
    const shopItem = button.closest('.menu-item');
    const title = shopItem.querySelector('.menu-item-title').innerText;
    const price = shopItem.querySelector('.menu-item-price').innerText;
    const imageSrc = shopItem.querySelector('.menu-item-image').src;
    const quantity = parseInt(shopItem.querySelector('.quantity-input').value);

    const cartItem = {
        title,
        price,
        imageSrc,
        quantity
    };

    addItemToCart(cartItem);
    updateCartTotal();
    showCart(); // Automatically show the cart when an item is added
}

function showCart() {
    const cartPanel = document.getElementById('cart-panel');
    cartPanel.classList.add('open');
}

function addItemToCart(cartItem) {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existingItem = cartItems.find(item => item.title === cartItem.title);

    if (existingItem) {
        existingItem.quantity += cartItem.quantity;
        updateCartItemDOM(existingItem);
    } else {
        cartItems.push(cartItem);
        addItemToCartDOM(cartItem);
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

function addItemToCartDOM(cartItem) {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartItemElement = document.createElement('li');
    cartItemElement.classList.add('cart-item');
    cartItemElement.innerHTML = `
        <img src="${cartItem.imageSrc}" alt="${cartItem.title}">
        <div class="cart-item-details">
            <span class="cart-item-title">${cartItem.title}</span>
            <div class="cart-item-price">${cartItem.price}</div>
        </div>
        <input class="cart-quantity-input" type="number" value="${cartItem.quantity}" min="1">
        <button class="btn-remove">X</button>
    `;

    cartItemElement.querySelector('.cart-quantity-input').addEventListener('change', quantityChanged);
    cartItemElement.querySelector('.btn-remove').addEventListener('click', removeCartItem);

    cartItemsContainer.append(cartItemElement);
}

function updateCartItemDOM(cartItem) {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartItemElement = Array.from(cartItemsContainer.children).find(item =>
        item.querySelector('.cart-item-title').innerText === cartItem.title
    );

    if (cartItemElement) {
        const quantityInput = cartItemElement.querySelector('.cart-quantity-input');
        quantityInput.value = cartItem.quantity;
    }
}

function updateCartTotal() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const total = cartItems.reduce((sum, item) => {
        const price = parseFloat(item.price.replace('$', ''));
        return sum + (price * item.quantity);
    }, 0);

    document.querySelector('.cart-total-price').innerText = total.toFixed(2);
}

function removeCartItem(event) {
    const button = event.target;
    const cartItemElement = button.closest('.cart-item');
    const title = cartItemElement.querySelector('.cart-item-title').innerText;

    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    cartItems = cartItems.filter(item => item.title !== title);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    cartItemElement.remove();
    updateCartTotal();
}

function quantityChanged(event) {
    const input = event.target;
    const cartItemElement = input.closest('.cart-item');
    const title = cartItemElement.querySelector('.cart-item-title').innerText;

    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartItem = cartItems.find(item => item.title === title);

    if (cartItem) {
        cartItem.quantity = parseInt(input.value);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }

    updateCartTotal();
}

function checkout() {
    alert('Thank you for your purchase!');
    localStorage.removeItem('cartItems');
    document.querySelector('.cart-items').innerHTML = '';
    updateCartTotal();
}
