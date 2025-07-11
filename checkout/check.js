document.addEventListener('DOMContentLoaded', () => {
    const orderItemsContainer = document.querySelector('.order-items');
    const subtotalEl   = document.getElementById('subtotal');
    const shippingEl   = document.getElementById('shipping');
    const taxEl        = document.getElementById('tax');
    const totalEl      = document.getElementById('total');
    const placeOrderBtn = document.querySelector('.place-order-btn');
  
    function getCartItems() {
      const stored = localStorage.getItem('cartItems') 
                  || localStorage.getItem('cart') 
                  || '[]';
      return JSON.parse(stored);
    }
  
    function displayOrderItems() {
      const items = getCartItems();
      orderItemsContainer.innerHTML = '';
  
      if (items.length === 0) {
        orderItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        return;
      }
  
      items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'order-item';
        div.innerHTML = `
          <img src="${item.image}" alt="${item.name}">
          <div>
            <p class="order-item-name">${item.name}</p>
            <p class="order-item-price">${item.price} DA × ${item.quantity}</p>
          </div>
        `;
        orderItemsContainer.appendChild(div);
      });
    }
  
    function updateOrderTotals() {
      const items = getCartItems();
      let subtotal = 0;
      items.forEach(item => subtotal += item.price * item.quantity);
  
      const shipping = items.length ? 800 : 0;
      const tax      = subtotal * 0.05;
      const total    = subtotal + shipping + tax;
  
      subtotalEl.textContent = `${subtotal.toFixed(2)} DA`;
      shippingEl.textContent = `${shipping.toFixed(2)} DA`;
      taxEl.textContent      = `${tax.toFixed(2)} DA`;
      totalEl.textContent    = `${total.toFixed(2)} DA`;
    }
  
    placeOrderBtn.addEventListener('click', () => {
      alert('Thank you! Your order has been placed.');
      localStorage.removeItem('cartItems');
      localStorage.removeItem('cart');
      displayOrderItems();
      updateOrderTotals();
    });
  
    displayOrderItems();
    updateOrderTotals();
  });
  