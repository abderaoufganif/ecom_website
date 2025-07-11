document.addEventListener('DOMContentLoaded', function () {
  // -------- Search suggestions -----------
  const searchInput = document.querySelector('.search-form input[type="search"]');
  const products = ["Perfumes", "Trousers", "T-shirts", "Hats", "Thermos"];
  const suggestionsBox = document.createElement('div');
  suggestionsBox.classList.add('suggestions-box');
  searchInput.parentNode.appendChild(suggestionsBox);

  searchInput.addEventListener('input', function () {
      const query = this.value.toLowerCase();
      suggestionsBox.innerHTML = '';

      if (query.length > 0) {
          const matchedProducts = products.filter(product => product.toLowerCase().includes(query));
          matchedProducts.forEach(product => {
              const suggestionItem = document.createElement('div');
              suggestionItem.textContent = product;
              suggestionItem.classList.add('suggestion-item');
              suggestionsBox.appendChild(suggestionItem);

              suggestionItem.addEventListener('click', function () {
                  searchInput.value = product;
                  suggestionsBox.innerHTML = '';
              });
          });
      }
  });

  document.addEventListener('click', function (e) {
      if (!e.target.closest('.search-form')) {
          suggestionsBox.innerHTML = '';
      }
  });

  // -------- Cart counter -----------
  const cartCountElement = document.querySelector('.cart-count');
  let cartItemCount = 0; // أو الرقم الحقيقي من بيانات السلة

  function addToCart() {
    cartItemCount++; // زيادة عدد العناصر في السلة
    updateCartDisplay(); // تحديث عرض السلة
  }
  
  // دالة لتحديث العداد
  function updateCartDisplay() {
    if (cartItemCount > 0) {
      cartCountElement.textContent = cartItemCount; // عرض العدد
      cartCountElement.style.display = 'block'; // إظهار العداد
    } else {
      cartCountElement.style.display = 'none'; // إخفاء العداد إذا كانت السلة فارغة
    }
  }
  
  
  // -------- User profile image -----------
  const userImage = document.querySelector('.user-image');
  const storedUserImage = localStorage.getItem('userProfileImage');

  if (storedUserImage) {
      userImage.src = storedUserImage;
  }

  // --- مثال للتخزين: (تضعه عند تسجيل الدخول الناجح)
  // localStorage.setItem('userProfileImage', 'https://yourdomain.com/path/to/profile.jpg');
});