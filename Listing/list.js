document.addEventListener('DOMContentLoaded', async () => {
  const searchInput     = document.querySelector('.search-form input[type="search"]');
  const suggestionsBox  = document.createElement('div');
  const cartCountEl     = document.getElementById('cart-count');
  const userImage       = document.querySelector('.user-image');
  const notification    = document.getElementById('notification');
  const notificationMsg = document.getElementById('notification-message');
  const closeNotifBtn   = document.getElementById('close-notification');
  const container       = document.getElementById('dynamicProducts');
  const pagination      = document.getElementById('paginationControls');

  const productsList = ["Perfumes", "Trousers", "T-shirts", "Hats", "Thermos"];
  suggestionsBox.className = 'suggestions-box';
  searchInput.parentNode.appendChild(suggestionsBox);

  searchInput.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase();
    suggestionsBox.innerHTML = '';
    if (!q) return;

    productsList
      .filter(p => p.toLowerCase().includes(q))
      .forEach(p => {
        const div = document.createElement('div');
        div.className = 'suggestion-item';
        div.textContent = p;
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

  function updateCartDisplay() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.style.display = cartCount > 0 ? 'block' : 'none';
    cartCountEl.textContent = cartCount;
    localStorage.setItem('cartCount', cartCount);
  }

  function showNotification(msg) {
    notificationMsg.innerHTML = msg;
    notification.style.display = 'block';
    setTimeout(() => notification.style.display = 'none', 3000);
  }

  closeNotifBtn?.addEventListener('click', () => {
    notification.style.display = 'none';
  });

  updateCartDisplay();

  const storedImg = localStorage.getItem('userProfileImage');
  if (storedImg) userImage.src = storedImg;

  document.addEventListener('click', e => {
    if (e.target.closest('.add-to-cart')) {
      const card = e.target.closest('.product-card');
      if (!card) return;

      const slug = card.dataset.slug;
      const product = allProducts.find(p => p.slug === slug);
      if (!product) return;

      let cart = JSON.parse(localStorage.getItem('cart')) || [];

      const existingItem = cart.find(item => item.slug === slug);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          id: product._id,
          title: product.title,
          price: product.price,
          image: product.images?.[0] || '/pages/Homepage/img/default.png',
          slug: product.slug,
          quantity: 1,
        });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartDisplay();
      showNotification('🛒 Added to cart');
      return;
    }

    if (e.target.closest('.product-favorite')) {
      const btn = e.target.closest('.product-favorite');
      btn.innerHTML = '❤️';
      showNotification('❤️ Added to wishlist');
      return;
    }
  });

  const pageSize = 12;
  let allProducts = [];
  let currentPage = 1;

  function makeCard(p) {
    const imgUrl = p.images?.[0]
      ? `/uploads/${p.images[0]}`
      : '/pages/Homepage/img/default.png';
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.slug = p.slug;
    card.innerHTML = `
      <div class="product-image-wrapper">
        <img src="${imgUrl}" alt="${p.title}" class="product-image">
        <button class="product-favorite"><img src="/pages/Homepage/img/Heart.svg" alt="Favorite"></button>
        <button class="add-to-cart">Add to cart</button>
      </div>
      <h3 class="product-name">${p.title}</h3>
      <p class="product-price">${p.price} DA</p>
    `;
    return card;
  }

  function renderPage(page) {
    container.innerHTML = '';
    const start = (page - 1) * pageSize;
    const items = allProducts.slice(start, start + pageSize);
    if (!items.length) {
      container.innerHTML = '<p>No products to display.</p>';
      return;
    }
    items.forEach(p => container.appendChild(makeCard(p)));
    renderPagination();
  }

  function renderPagination() {
    pagination.innerHTML = '';
    const total = Math.ceil(allProducts.length / pageSize);

    const prev = document.createElement('button');
    prev.textContent = '« Prev';
    prev.disabled = currentPage === 1;
    prev.onclick = () => { currentPage--; renderPage(currentPage); };
    pagination.appendChild(prev);

    for (let i = 1; i <= total; i++) {
      const btn = document.createElement('button');
      btn.textContent = i;
      if (i === currentPage) btn.classList.add('active');
      btn.onclick = () => { currentPage = i; renderPage(i); };
      pagination.appendChild(btn);
    }

    const next = document.createElement('button');
    next.textContent = 'Next »';
    next.disabled = currentPage === total;
    next.onclick = () => { currentPage++; renderPage(currentPage); };
    pagination.appendChild(next);
  }

  try {
    const res = await fetch('/api/products/products');
    if (!res.ok) throw new Error(res.statusText);
    allProducts = await res.json();
    renderPage(1);
  } catch (err) {
    console.error('Error fetching products:', err);
    container.innerHTML = '<p>Failed to load products.</p>';
  }

  container.addEventListener('click', e => {
    const card = e.target.closest('.product-card');
    if (!card) return;
    if (e.target.closest('.add-to-cart') || e.target.closest('.product-favorite')) return;
    const slug = card.dataset.slug;
    window.location.href = `/pages/product/ProductDetails.html?slug=${encodeURIComponent(slug)}`;
  });
});
