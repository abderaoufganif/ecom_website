document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    async function fetchDashboardStats() {
        try {
            const [ordersResponse, productsResponse, customersResponse] = await Promise.all([
                fetch('/api/orders', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }),
                fetch('/api/products', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }),
                fetch('/api/users', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
            ]);

            if (!ordersResponse.ok || !productsResponse.ok || !customersResponse.ok) {
                throw new Error('Failed to fetch dashboard data');
            }

            const orders = await ordersResponse.json();
            const products = await productsResponse.json();
            const customers = await customersResponse.json();

            document.getElementById('total-orders').textContent = orders.length;
            document.getElementById('total-products').textContent = products.length;
            document.getElementById('total-customers').textContent = customers.length;

            const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
            document.getElementById('total-revenue').textContent = `${totalRevenue} DA`;

            displayRecentOrders(orders.slice(0, 5));

            const productSales = calculateProductSales(orders);
            displayTopProducts(productSales.slice(0, 5));

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            alert('Failed to load dashboard data');
        }
    }

    function calculateProductSales(orders) {
        const productSales = new Map();

        orders.forEach(order => {
            order.orderItems.forEach(item => {
                const productId = item.product;
                const quantity = item.quantity;
                const price = item.price;

                if (!productSales.has(productId)) {
                    productSales.set(productId, {
                        name: item.name,
                        sales: 0,
                        revenue: 0
                    });
                }

                const product = productSales.get(productId);
                product.sales += quantity;
                product.revenue += quantity * price;
            });
        });

        return Array.from(productSales.values())
            .sort((a, b) => b.sales - a.sales);
    }

    function displayRecentOrders(orders) {
        const tbody = document.getElementById('recent-orders-body');
        tbody.innerHTML = '';

        orders.forEach(order => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${order._id.slice(-6)}</td>
                <td>${order.shippingAddress.FullName}</td>
                <td>${new Date(order.createdAt).toLocaleDateString()}</td>
                <td>${order.totalPrice} DA</td>
                <td>${order.isPaid ? 'Completed' : 'Processing'}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    function displayTopProducts(products) {
        const tbody = document.getElementById('top-products-body');
        tbody.innerHTML = '';

        products.forEach(product => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${product.name}</td>
                <td>${product.sales}</td>
                <td>${product.revenue} DA</td>
            `;
            tbody.appendChild(tr);
        });
    }

    document.querySelector('.logout-icon').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        window.location.href = '/AdminPanel/index.html';
    });

    fetchDashboardStats();
}); 