document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const resetPasswordForm = document.getElementById('resetPasswordForm');
    const googleBtn = document.querySelector('.google-login-btn');

    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromGoogle = urlParams.get('token');
    if (tokenFromGoogle) {
        localStorage.setItem('token', tokenFromGoogle);
        window.history.replaceState({}, document.title, window.location.pathname); 
    }

    const userToken = localStorage.getItem('token');
    if (userToken) {
        const path = window.location.pathname;
        if (path.includes('login') || path.includes('register') || path.includes('forgotpsw')) {
            window.location.href = '/pages/profile/profile-Account Details.html';
            return;
        }
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/api/users/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                if (response.ok) {
                    const data = await response.json();
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    window.location.href = '/index.html';
                } else {
                    const error = await response.json();
                    alert(error.message || 'Login failed');
                }
            } catch (error) {
                console.error('Login error:', error);
                alert('An error occurred during login');
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }

            try {
                const response = await fetch('/api/users/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password })
                });

                if (response.ok) {
                    alert('Registration successful! Please login.');
                    window.location.href = '/pages/login_singup_forget/login.html';
                } else {
                    const error = await response.json();
                    alert(error.message || 'Registration failed');
                }
            } catch (error) {
                console.error('Registration error:', error);
                alert('An error occurred during registration');
            }
        });
    }

    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;

            try {
                const response = await fetch('/api/users/forgot-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });

                if (response.ok) {
                    alert('Password reset instructions sent to your email');
                    window.location.href = '/pages/login_singup_forget/login.html';
                } else {
                    const error = await response.json();
                    alert(error.message || 'Failed to send reset instructions');
                }
            } catch (error) {
                console.error('Forgot password error:', error);
                alert('An error occurred while processing your request');
            }
        });
    }

    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const userId = urlParams.get('userId');
            const expires = urlParams.get('expires');
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }

            try {
                const response = await fetch('/api/users/reset-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, password, expires })
                });

                if (response.ok) {
                    alert('Password reset successful! Please login.');
                    window.location.href = '/pages/login_singup_forget/login.html';
                } else {
                    const error = await response.json();
                    alert(error.message || 'Password reset failed');
                }
            } catch (error) {
                console.error('Reset password error:', error);
                alert('An error occurred while resetting your password');
            }
        });
    }

    if (googleBtn) {
        googleBtn.addEventListener('click', () => {
            window.location.href = '/api/auth/google';
        });
    }

    function logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/pages/login_singup_forget/login.html';
    }
});
