document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    async function fetchOrders() {
        try {
            const response = await fetch('/api/orders', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) throw new Error('Failed to fetch orders');
            
            const orders = await response.json();
            displayOrders(orders);
        } catch (error) {
            console.error('Error fetching orders:', error);
            alert('Failed to load orders');
        }
    }

    function displayOrders(orders) {
        const tbody = document.querySelector('.products-table tbody');
        tbody.innerHTML = '';
        
        orders.forEach(order => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><img src="${order.orderItems[0].image}" alt="Order thumbnail" class="product-thumb"></td>
                <td>${order.orderItems[0].name}</td>
                <td>${new Date(order.createdAt).toLocaleDateString()}</td>
                <td>${order.totalPrice} DA</td>
                <td>${order.isPaid ? 'Completed' : 'Processing'}</td>
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
            const response = await fetch(`/api/orders?search=${searchTerm}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) throw new Error('Search failed');
            
            const orders = await response.json();
            displayOrders(orders);
        } catch (error) {
            console.error('Search error:', error);
        }
    });

    fetchOrders();
}); 