// Chức năng giỏ hàng
const Cart = {
    // Lấy giỏ hàng từ localStorage
    getCart() {
        return JSON.parse(localStorage.getItem('cart')) || [];
    },

    // Lưu giỏ hàng vào localStorage
    saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    },

    // Thêm sản phẩm vào giỏ hàng
    addToCart(product) {
        let cart = this.getCart();
        let existingItem = cart.find(item => item.title === product.title);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                title: product.title,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }

        this.saveCart(cart);
        this.showNotification('Đã thêm sản phẩm vào giỏ hàng!');
    },

    // Xóa sản phẩm khỏi giỏ hàng
    removeFromCart(index) {
        let cart = this.getCart();
        cart.splice(index, 1);
        this.saveCart(cart);
    },

    // Cập nhật số lượng sản phẩm
    updateQuantity(index, quantity) {
        let cart = this.getCart();
        if (quantity < 1) quantity = 1;
        cart[index].quantity = quantity;
        this.saveCart(cart);
    },

    // Tính tổng tiền
    calculateTotal() {
        let cart = this.getCart();
        return cart.reduce((total, item) => {
            let price = parseInt((item.price || '0').replace(/\D/g, ''));
            return total + (price * item.quantity);
        }, 0);
    },

    // Hiển thị thông báo
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'custom-toast';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    },

    // Cập nhật tổng tiền ở khối bên phải
    updateSummaryBox() {
        if (document.getElementById('cartSubtotal')) {
            const total = this.calculateTotal();
            document.getElementById('cartSubtotal').textContent = total.toLocaleString() + 'đ';
            document.getElementById('cartTotal').textContent = total.toLocaleString() + 'đ';
        }
    },

    // Hiển thị trang giỏ hàng
    renderCartPage() {
        const cartContent = document.getElementById('cartContent');
        if (!cartContent) return;

        const cart = this.getCart();
        let html = '';

        if (cart.length === 0) {
            html = `<div class='cart-empty'>
                <img src='./images2/empty-cart.png' style='width:120px;opacity:0.7;margin-bottom:16px;'>
                <div>Chưa có sản phẩm nào trong giỏ hàng.</div>
                <a href='index.html' class='btn btn-outline-primary mt-4 px-4 py-2 font-weight-bold'>Quay trở lại cửa hàng</a>
            </div>`;
        } else {
            html = `<div class='table-responsive'><table class='table cart-table align-middle'>
                <thead><tr>
                    <th>Ảnh</th><th>Sản phẩm</th><th>Giá</th><th>Số lượng</th><th>Thành tiền</th><th></th>
                </tr></thead><tbody>`;

            cart.forEach((item, idx) => {
                let price = parseInt((item.price || '0').replace(/\D/g, ''));
                let subtotal = price * item.quantity;
                html += `<tr>
                    <td><img src='${item.image}' class='cart-img'></td>
                    <td>${item.title}</td>
                    <td>${item.price}</td>
                    <td><input type='number' min='1' value='${item.quantity}' class='form-control form-control-sm cart-qty' data-idx='${idx}' style='width:70px;'></td>
                    <td>${subtotal.toLocaleString()}đ</td>
                    <td><span class='cart-remove' data-idx='${idx}' title='Xóa'><i class='fas fa-trash'></i></span></td>
                </tr>`;
            });

            html += `</tbody></table></div>`;
        }

        cartContent.innerHTML = html;
        this.updateSummaryBox();
    },

    // Khởi tạo chức năng giỏ hàng
    init() {
        
        // Thêm xử lý cho trang giỏ hàng nếu đang ở trang giỏ hàng
        if (document.getElementById('cartContent')) {
            this.renderCartPage();

            // Xử lý xóa sản phẩm
            document.getElementById('cartContent').addEventListener('click', (e) => {
                if (e.target.closest('.cart-remove')) {
                    const idx = e.target.closest('.cart-remove').dataset.idx;
                    this.removeFromCart(idx);
                    this.renderCartPage();
                    this.updateSummaryBox();
                }
            });

            // Xử lý cập nhật số lượng
            document.getElementById('cartContent').addEventListener('change', (e) => {
                if (e.target.classList.contains('cart-qty')) {
                    const idx = e.target.dataset.idx;
                    const quantity = parseInt(e.target.value);
                    this.updateQuantity(idx, quantity);
                    this.renderCartPage();
                    this.updateSummaryBox();
                }
            });

        }
    }
};

// Khởi tạo giỏ hàng khi trang đã tải xong
document.addEventListener('DOMContentLoaded', () => {
    Cart.init();
});