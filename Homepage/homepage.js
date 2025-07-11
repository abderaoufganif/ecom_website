document.addEventListener('DOMContentLoaded', () => {
  const searchInput               = document.querySelector('.search-form input[type="search"]');
  const suggestionsBox            = document.createElement('div');
  const cartCountElement          = document.getElementById('cart-count');
  const userImage                 = document.querySelector('.user-image');
  const notification              = document.getElementById('notification');
  const notificationMessage       = document.getElementById('notification-message');
  const closeNotificationBtn      = document.getElementById('close-notification');
  const productContainerHome      = document.getElementById('productContainer');
  const productsContainerListing  = document.getElementById('dynamicProducts');
  const cartContainer             = document.getElementById('cart-container'); 
  
  function shuffleArray(arr) {
    for (let i = arr.length -1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  async function loadRandomProducts(intoEl) {
    if (!intoEl) return;
    try {
      const res = await fetch('/api/products/products');
      if (!res.ok) throw new Error(res.statusText);
      const products = await res.json();
      intoEl.innerHTML = '';

      if (!products.length) {
        intoEl.innerHTML = '<p>No products found.</p>';
        return;
      }

      shuffleArray(products);
      products.slice(0, 4).forEach(p => {
        const imgUrl = p.images?.[0] ? `/uploads/${p.images[0]}` : '/pages/Homepage/img/default.png';
        const card = document.createElement('div');
        card.className = 'product-card';
        card.dataset.slug = p.slug;
        card.innerHTML = `
          <div class="product-image-wrapper">
            <img src="${imgUrl}" alt="${p.title}" class="product-image">
            <button class="product-favorite"><img src="/pages/Homepage/img/Heart.svg"></button>
            <button class="add-to-cart">Add to cart <img src="/pages/Homepage/img/Add to cart.svg"></button>
          </div>
          <h3 class="product-name">${p.title}</h3>
          <p class="product-price">${p.price} DA</p>
        `;
        intoEl.appendChild(card);
      });
    } catch (err) {
      console.error('Fetch error:', err);
      intoEl.innerHTML = '<p>Failed to load products.</p>';
    }
  }

  function displayCartItems() {
    const storedCartItems = localStorage.getItem('cartItems');
    const cartItems = storedCartItems ? JSON.parse(storedCartItems) : [];
    cartContainer.innerHTML = ''; 
    
    if (cartItems.length === 0) {
      cartContainer.innerHTML = '<p>Your cart is empty.</p>';
    } else {
      cartItems.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
          <img src="${item.image}" alt="${item.name}" class="cart-item-image">
          <div class="cart-item-info">
            <p class="cart-item-name">${item.name}</p>
            <p class="cart-item-price">${item.price} DA</p>
            <p class="cart-item-quantity">Quantity: ${item.quantity}</p>
          </div>
        `;
        cartContainer.appendChild(cartItem);
      });
    }
  }

  const productsList = ["Perfumes", "Trousers", "T-shirts", "Hats", "Thermos"];
  suggestionsBox.classList.add('suggestions-box');
  searchInput.parentNode.appendChild(suggestionsBox);

  searchInput.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase();
    suggestionsBox.innerHTML = '';
    if (!q) return;

    productsList
      .filter(p => p.toLowerCase().includes(q))
      .forEach(p => {
        const div = document.createElement('div');
        div.textContent = p;
        div.classList.add('suggestion-item');
        div.addEventListener('click', () => {
          searchInput.value = p;
          suggestionsBox.innerHTML = '';
        });
        suggestionsBox.appendChild(div);
      });
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.search-form')) suggestionsBox.innerHTML = '';
  });

  let cartCount = parseInt(localStorage.getItem('cartCount')) || 0;

  function updateCartDisplay() {
    cartCountElement.textContent = cartCount;
    cartCountElement.style.display = cartCount > 0 ? 'block' : 'none';
    localStorage.setItem('cartCount', cartCount);
  }

  const storedUserImage = localStorage.getItem('userProfileImage');
  if (storedUserImage) userImage.src = storedUserImage;

  function showNotification(msg) {
    notificationMessage.innerHTML = msg;
    notification.style.display = 'block';
    setTimeout(() => notification.style.display = 'none', 3000);
  }
  closeNotificationBtn.addEventListener('click', () => notification.style.display = 'none');

  document.addEventListener('click', e => {
    if (e.target.closest('.add-to-cart')) {
      const card = e.target.closest('.product-card');
      const slug  = card.dataset.slug;
      const name  = card.querySelector('.product-name').textContent;
      const price = card.querySelector('.product-price').textContent.replace(' DA','');
      const img   = card.querySelector('img.product-image').src;

      const stored = localStorage.getItem('cartItems');
      const cartItems = stored ? JSON.parse(stored) : [];

      const existing = cartItems.find(item => item.slug === slug);
      if (existing) {
        existing.quantity++;
      } else {
        cartItems.push({ slug, name, price: Number(price), image: img, quantity: 1 });
      }

      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      cartCount++;
      updateCartDisplay();
      showNotification('🛒 Added to cart');
    }

    if (e.target.closest('.product-favorite')) {
      const btn = e.target.closest('.product-favorite');
      btn.innerHTML = '❤️';
      showNotification('❤️ Added to wishlist');
    }

    const card = e.target.closest('.product-card');
    if (card && !e.target.closest('button')) { 
      const slug = card.dataset.slug;
      location.href = `/pages/product/ProductDetails.html?slug=${encodeURIComponent(slug)}`;
    }
  });

  loadRandomProducts(productContainerHome);
  loadRandomProducts(productsContainerListing);

  updateCartDisplay();
  
  displayCartItems();
});
