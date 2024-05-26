document.addEventListener('DOMContentLoaded', () => {
    const filterButton = document.querySelector('.filter-btn');
    const filterContainer = document.querySelector('.filter-container');
    const filterDropdown = document.querySelector('.filter-dropdown');

    filterContainer.addEventListener('mouseover', () => {
        filterContainer.classList.add('show');
    });

    filterContainer.addEventListener('mouseout', () => {
        filterContainer.classList.remove('show');
    });

    const filterOptions = document.querySelectorAll('.filter-option');
    filterOptions.forEach(option => {
        option.addEventListener('click', (event) => {
            const category = event.target.innerText.toLowerCase();
            if (event.target.classList.contains('selected')) {
                event.target.classList.remove('selected');
            } else {
                event.target.classList.add('selected');
            }
            applyFilters();
        });
    });

    // Show all items by default
    filterMenu('all');

    // Close dropdown when clicking outside
    document.addEventListener('click', (event) => {
        if (!filterContainer.contains(event.target)) {
            filterContainer.classList.remove('show');
        }
    });

    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCartClicked);
    });

    updateCart();
});

function applyFilters() {
    const selectedOptions = document.querySelectorAll('.filter-option.selected');
    const selectedCategories = Array.from(selectedOptions).map(option => option.innerText.toLowerCase());
    if (selectedCategories.length === 0) {
        filterMenu('all');
    } else {
        filterMenu(selectedCategories);
    }
}

function filterMenu(categories) {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        const itemCategories = Array.from(item.classList).filter(cls => cls !== 'menu-item' && cls !== 'show' && cls !== 'hide');
        if (categories === 'all' || categories.some(category => itemCategories.includes(category))) {
            item.classList.add('show');
            item.classList.remove('hide');
        } else {
            item.classList.add('hide');
            item.classList.remove('show');
        }
    });
}

function increaseQuantity(button) {
    const input = button.previousElementSibling;
    input.value = parseInt(input.value) + 1;
}

function decreaseQuantity(button) {
    const input = button.nextElementSibling;
    if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
    }
}

function addToCartClicked(event) {
    const button = event.target;
    const shopItem = button.closest('.menu-item');
    const title = shopItem.querySelector('.menu-item-title').innerText;
    const price = shopItem.querySelector('.menu-item-price').innerText.replace('$', '');
    const imageSrc = shopItem.querySelector('.menu-item-image').src;
    const quantity = parseInt(shopItem.querySelector('.quantity-input').value);

    const cartItem = {
        title,
        price: parseFloat(price),
        imageSrc,
        quantity
    };

    addItemToCart(cartItem);
    updateCartTotal();
}

function addItemToCart(cartItem) {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existingItem = cartItems.find(item => item.title === cartItem.title);

    if (existingItem) {
        existingItem.quantity += cartItem.quantity; // Add the new quantity to the existing one
    } else {
        cartItems.push(cartItem);
        addItemToCartDOM(cartItem);
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartItemDOM(cartItem);
}

function addItemToCartDOM(cartItem) {
    const cartItemsContainer = document.querySelector('.cart-items');
    const existingCartItemElement = Array.from(cartItemsContainer.children).find(item =>
        item.querySelector('.cart-item-title').innerText === cartItem.title
    );

    if (existingCartItemElement) {
        const quantityInput = existingCartItemElement.querySelector('.cart-quantity-input');
        quantityInput.value = parseInt(quantityInput.value) + cartItem.quantity;
    } else {
        const cartItemElement = document.createElement('li');
        cartItemElement.classList.add('cart-item');
        cartItemElement.innerHTML = `
            <img src="${cartItem.imageSrc}" alt="${cartItem.title}">
            <div class="cart-item-details">
                <span class="cart-item-title">${cartItem.title}</span>
                <div class="cart-item-price">$${cartItem.price.toFixed(2)}</div>
            </div>
            <input class="cart-quantity-input" type="number" value="${cartItem.quantity}" min="1">
            <button class="btn-remove">X</button>
        `;

        cartItemElement.querySelector('.cart-quantity-input').addEventListener('change', quantityChanged);
        cartItemElement.querySelector('.btn-remove').addEventListener('click', removeCartItem);

        cartItemsContainer.append(cartItemElement);
    }
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
        const price = parseFloat(item.price);
        return sum + (price * item.quantity);
    }, 0);

    document.querySelector('.cart-total-price').innerText = `$${total.toFixed(2)}`;
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

function updateCart() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    cartItems.forEach(item => {
        addItemToCartDOM(item);
    });
    updateCartTotal();
}
