document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    const form = document.querySelector('.add-product-form');
    const imageUpload = document.getElementById('product-images');
    const imagePreviews = document.querySelector('.image-previews');
    const colorSwatches = document.querySelectorAll('.color-swatch');
    const sizeButtons = document.querySelectorAll('.size-btn');

    imageUpload.addEventListener('change', (e) => {
        imagePreviews.innerHTML = '';
        Array.from(e.target.files).forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                imagePreviews.appendChild(img);
            };
            reader.readAsDataURL(file);
        });
    });

    colorSwatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
            colorSwatches.forEach(s => s.classList.remove('active'));
            swatch.classList.add('active');
        });
    });

    sizeButtons.forEach(button => {
        button.addEventListener('click', () => {
            sizeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData();
        const selectedColors = Array.from(document.querySelectorAll('.color-swatch.active'))
            .map(swatch => swatch.getAttribute('title'));
        const selectedSizes = Array.from(document.querySelectorAll('.size-btn.active'))
            .map(btn => btn.textContent);

        formData.append('title', document.getElementById('product-title').value);
        formData.append('price', document.getElementById('product-price').value);
        formData.append('category', document.getElementById('product-category').value);
        formData.append('slug', document.getElementById('product-slug').value);
        formData.append('sku', document.getElementById('product-sku').value);
        formData.append('description', document.getElementById('product-description').value);
        formData.append('stock_status', document.getElementById('stock-status').value);
        formData.append('available_quantity', document.getElementById('available-quantity').value);
        formData.append('colors', JSON.stringify(selectedColors));
        formData.append('sizes', JSON.stringify(selectedSizes));

        const imageFiles = imageUpload.files;
        for (let i = 0; i < imageFiles.length; i++) {
            formData.append('images', imageFiles[i]);
        }

        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) throw new Error('Failed to add product');

            const data = await response.json();
            alert('Product added successfully!');
            window.location.href = '/AdminPanel/pages/products.html';
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Failed to add product');
        }
    });
}); 