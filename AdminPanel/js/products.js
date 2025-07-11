document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    async function fetchProducts() {
        try {
            const response = await fetch('/api/products', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) throw new Error('Failed to fetch products');
            
            const products = await response.json();
            displayProducts(products);
        } catch (error) {
            console.error('Error fetching products:', error);
            alert('Failed to load products');
        }
    }

    function displayProducts(products) {
        const tbody = document.querySelector('.products-table tbody');
        tbody.innerHTML = '';
        
        products.forEach(product => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><img src="${product.image}" alt="${product.title}" class="product-thumb"></td>
                <td>${product.title}</td>
                <td>${product.sku}</td>
                <td>${product.price} DA</td>
                <td>${product.countInStock}</td>
                <td>${product.category}</td>
                <td>
                    <button class="btn-action btn-more" aria-label="More actions">
                        <i class="fas fa-ellipsis-h"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    const searchInput = document.querySelector('.search-container input');
    searchInput.addEventListener('input', async (e) => {
        const searchTerm = e.target.value;
        try {
            const response = await fetch(`/api/products?search=${searchTerm}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) throw new Error('Search failed');
            
            const products = await response.json();
            displayProducts(products);
        } catch (error) {
            console.error('Search error:', error);
        }
    });

    fetchProducts();
}); 