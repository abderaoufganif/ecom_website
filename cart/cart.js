// تحميل المنتجات من localStorage
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
  }
  
  // حفظ السلة
  function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  
  // عرض السلة
  function renderCart() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cart = getCart();
    cartItemsContainer.innerHTML = '';
  
    cart.forEach((product, index) => {
      const item = document.createElement('div');
      item.className = 'cart-item';
      item.innerHTML = `
        <img src="${product.image}" alt="${product.title}">
        <div class="item-details">
          <p class="item-name">${product.title}</p>
          <p>Color: <span style="color:${product.color}">●</span> Size: ${product.size}</p>
          <p class="item-price">${product.price} DA</p>
          <div class="quantity">
            <button class="decrease" data-index="${index}">-</button>
            <span>${product.quantity}</span>
            <button class="increase" data-index="${index}">+</button>
          </div>
        </div>
        <button class="remove" data-index="${index}">✖</button>
      `;
      cartItemsContainer.appendChild(item);
    });
  
    updateSummary();
  }
  
  // تحديث ملخص الطلب
  function updateSummary() {
    const cart = getCart();
    let subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let tax = 300; // ثابت مثلا
    let total = subtotal + tax;
  
    document.querySelector('.order-summary p:nth-child(2) span').textContent = subtotal + ' DA';
    document.querySelector('.order-summary p:nth-child(4) span').textContent = tax + ' DA';
    document.querySelector('.order-summary h4 span').textContent = total + ' DA';
  }
  
  // زيادة الكمية
  document.addEventListener('click', e => {
    if (e.target.classList.contains('increase')) {
      const index = e.target.dataset.index;
      const cart = getCart();
      cart[index].quantity++;
      saveCart(cart);
      renderCart();
    }
  });
  
  // تقليل الكمية
  document.addEventListener('click', e => {
    if (e.target.classList.contains('decrease')) {
      const index = e.target.dataset.index;
      const cart = getCart();
      if (cart[index].quantity > 1) {
        cart[index].quantity--;
        saveCart(cart);
        renderCart();
      }
    }
  });
  
  // إزالة منتج
  document.addEventListener('click', e => {
    if (e.target.classList.contains('remove')) {
      const index = e.target.dataset.index;
      const cart = getCart();
      cart.splice(index, 1);
      saveCart(cart);
      renderCart();
    }
  });
  
  // عند تحميل الصفحة
  document.addEventListener('DOMContentLoaded', () => {
    renderCart();
  });
  