document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        window.location.href = '/AdminPanel/index.html';
        return;
    }

    async function fetchCustomers() {
        try {
            const response = await fetch('/api/users', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) throw new Error('Failed to fetch customers');
            
            const customers = await response.json();
            displayCustomers(customers);
        } catch (error) {
            console.error('Error fetching customers:', error);
            alert('Failed to load customers');
        }
    }

    function displayCustomers(customers) {
        const tbody = document.querySelector('.products-table tbody');
        tbody.innerHTML = '';
        
        customers.forEach(customer => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><span class="initials-placeholder">${customer.name.charAt(0)}</span></td>
                <td>${customer.name}</td>
                <td>${customer.email}</td>
                <td>${customer.streetAddress}, ${customer.city}, ${customer.country}</td>
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
            const response = await fetch(`/api/users?search=${searchTerm}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) throw new Error('Search failed');
            
            const customers = await response.json();
            displayCustomers(customers);
        } catch (error) {
            console.error('Search error:', error);
        }
    });

    fetchCustomers();
}); 