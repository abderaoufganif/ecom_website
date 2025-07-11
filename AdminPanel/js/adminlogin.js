document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('form');
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        try {
            const response = await fetch('/api/Users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                localStorage.setItem('adminToken', data.token);
                localStorage.setItem('adminUser', JSON.stringify({
                    _id: data._id,
                    name: data.name,
                    email: data.email,
                    isAdmin: data.isAdmin
                }));
                
                window.location.href = 'pages/dashboard.html';
            } else {
                alert(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred during login');
        }
    });
}); 