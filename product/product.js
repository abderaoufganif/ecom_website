document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(location.search);
  const slug   = params.get('slug');
  if (!slug) { alert('No product selected'); return; }

  let product = null; 

  try {
    const res = await fetch(`/api/products/slug/${slug}`);
    if (!res.ok) throw new Error('Product not found');
    product = await res.json();

    document.querySelector('.product-title').textContent = product.title;
    document.querySelector('.product-price').textContent = `${product.price} DA`;

    const imgEl = document.querySelector('.product-image img');
    imgEl.src = product.images?.[0] ? `/uploads/${product.images[0]}` : '/pages/Homepage/img/default.png';
    imgEl.alt = product.title;

    const colorsContainer = document.querySelector('.colors');
    colorsContainer.innerHTML = '';
    product.colors.forEach(c => {
      const span = document.createElement('span');
      span.className = 'color';
      span.style.backgroundColor = c;
      colorsContainer.appendChild(span);
    });

    const sizesContainer = document.querySelector('.sizes');
    sizesContainer.innerHTML = '';
    product.sizes.forEach(s => {
      const btn = document.createElement('button');
      btn.className = 'size';
      btn.textContent = s;
      sizesContainer.appendChild(btn);
    });

    const descEl = document.querySelector('.description-text');
    descEl.textContent = product.description;

  } catch (err) {
    console.error(err);
    alert('Error loading product');
  }

  document.querySelectorAll('.quantity-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = document.querySelector('.quantity-input');
      let v = parseInt(input.value);
      input.value = btn.textContent === '+' ? Math.min(v + 1, 99) : Math.max(v - 1, 1);
    });
  });

  const cartCountEl = document.getElementById('cart-count');

  function updateCartDisplay() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.textContent = cartCount;
    cartCountEl.style.display = cartCount > 0 ? 'block' : 'none';
    localStorage.setItem('cartCount', cartCount);
  }

  function showNotification(msg) {
    const notif = document.getElementById('notification');
    document.getElementById('notification-message').innerHTML = msg;
    notif.style.display = 'block';
    setTimeout(() => notif.style.display = 'none', 3000);
  }

  document.getElementById('close-notification')
    .addEventListener('click', () => document.getElementById('notification').style.display = 'none');

  updateCartDisplay();

  document.querySelector('.addtocart').addEventListener('click', () => {
    if (!product) return;

    const selectedColor = document.querySelector('.color.selected')?.style.backgroundColor || null;
    const selectedSize  = document.querySelector('.size.selected')?.textContent || null;
    const quantity      = parseInt(document.querySelector('.quantity-input').value) || 1;

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existingItem = cart.find(item =>
      item.slug === product.slug &&
      item.selectedColor === selectedColor &&
      item.selectedSize === selectedSize
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        id: product._id,
        title: product.title,
        price: product.price,
        image: product.images?.[0] ? `/uploads/${product.images[0]}` : '/pages/Homepage/img/default.png',
        slug: product.slug,
        selectedColor,
        selectedSize,
        quantity,
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    showNotification('🛒 Product added to cart!');
  });

  document.addEventListener('click', e => {
    if (e.target.classList.contains('color')) {
      document.querySelectorAll('.color').forEach(c => c.classList.remove('selected'));
      e.target.classList.add('selected');
    }
    if (e.target.classList.contains('size')) {
      document.querySelectorAll('.size').forEach(s => s.classList.remove('selected'));
      e.target.classList.add('selected');
    }
  });
});

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
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
    shuffleArray(products);
    intoEl.innerHTML = '';
    products.slice(0, 4).forEach(p => {
      const url = p.images?.[0] ? `/uploads/${p.images[0]}` : '/pages/Homepage/img/default.png';
      const card = document.createElement('div');
      card.className = 'product-card';
      card.dataset.slug = p.slug;
      card.innerHTML = `
        <div class="product-image-wrapper">
          <img src="${url}" alt="${p.title}" class="product-image">
          <button class="product-favorite">
            <img src="/pages/Homepage/img/Heart.svg" alt="Favorite">
          </button>
          <button class="add-to-cart">Add to cart</button>
        </div>
        <h3 class="product-name">${p.title}</h3>
        <p class="product-price">${p.price} DA</p>
      `;
      intoEl.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    intoEl.innerHTML = '<p>Failed to load products.</p>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const randomHome = document.getElementById('random-products-home');
  loadRandomProducts(randomHome);
});

document.body.addEventListener('click', e => {
  const card = e.target.closest('.product-card');
  if (card && !e.target.closest('button')) {
    const slug = card.dataset.slug;
    location.href = `/pages/product/ProductDetails.html?slug=${encodeURIComponent(slug)}`;
  }
});
