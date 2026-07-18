let cart = [];
const phoneOwner = "923017197577"; // Restaurant Owner's WhatsApp Number

function addToCart(itemName) {
    Swal.fire({
        title: 'Add to Cart',
        text: 'Specify size/variation (e.g. Small, Medium) or leave empty:',
        input: 'text',
        inputPlaceholder: 'Size or variation',
        showCancelButton: true,
        confirmButtonText: 'Add to Cart',
        confirmButtonColor: '#e44d26'
    }).then((result) => {
        if (result.isConfirmed) {
            let size = result.value || 'Default';
            cart.push({ item: itemName, size: size, qty: 1 });
            updateCartCount();
            
            Swal.fire({
                title: 'Added!',
                text: itemName + ' has been added to your cart.',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });
        }
    });
}

function updateCartCount() {
    document.getElementById('cartCount').innerText = cart.length;
    if(cart.length > 0) {
        document.getElementById('cartBtn').style.display = 'flex';
    } else {
        document.getElementById('cartBtn').style.display = 'none';
    }
}

function openCartModal() {
    let cartItemsDiv = document.getElementById('cartItemsList');
    cartItemsDiv.innerHTML = '';
    
    if(cart.length === 0) {
        cartItemsDiv.innerHTML = '<p>Your cart is empty.</p>';
    } else {
        cart.forEach((c, index) => {
            cartItemsDiv.innerHTML += `
                <div class="cart-item-row" style="display:flex; justify-content:space-between; align-items:center; padding:10px; border-bottom:1px solid #ddd;">
                    <div style="flex-grow:1;"><strong>${c.item}</strong><br><small style="color:#666;">Size/Var: ${c.size}</small></div>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <input type="number" min="1" value="${c.qty}" onchange="updateQty(${index}, this.value)" style="width: 50px; padding: 5px; border: 1px solid #ccc; border-radius: 4px;">
                        <button onclick="removeItem(${index})" style="color:red; background:none; border:none; font-size:1.5rem; cursor:pointer;">&times;</button>
                    </div>
                </div>`;
        });
    }
    document.getElementById("cartModal").style.display = "flex";
}

function updateQty(index, newQty) {
    cart[index].qty = newQty;
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCartCount();
    openCartModal(); // Refresh list
}

function closeCartModal() {
    document.getElementById("cartModal").style.display = "none";
}

function openCheckout() {
    if(cart.length === 0) {
        Swal.fire('Error', 'Your cart is empty', 'error');
        return;
    }
    closeCartModal();
    document.getElementById("checkoutModal").style.display = "flex";
}

function closeCheckoutModal() {
    document.getElementById("checkoutModal").style.display = "none";
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    if (event.target == document.getElementById("cartModal")) closeCartModal();
    if (event.target == document.getElementById("checkoutModal")) closeCheckoutModal();
}

function submitOrder(event) {
    event.preventDefault();
    
    const name = document.getElementById("fullName").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;
    const instructions = document.getElementById("instructions").value || "None";
    
    let itemsText = "";
    cart.forEach(c => {
        itemsText += `- ${c.item} (${c.size}) x${c.qty}%0A`;
    });

    const waMessage = `*New Order - Snappy Foods*%0A%0A` +
                      `*Order Items:*%0A${itemsText}%0A` +
                      `*Customer Details:*%0A` +
                      `*Name:* ${name}%0A` +
                      `*Phone:* ${phone}%0A` +
                      `*Address:* ${address}%0A%0A` +
                      `*Instructions:* ${instructions}`;

    const waLink = `https://wa.me/${phoneOwner}?text=${waMessage}`;

    Swal.fire({
        title: 'Order Ready to Send!',
        text: 'You will now be redirected to WhatsApp to send your order.',
        icon: 'success',
        confirmButtonText: 'Proceed to WhatsApp',
        confirmButtonColor: '#28a745'
    }).then((result) => {
        if (result.isConfirmed) {
            window.open(waLink, '_blank');
            closeCheckoutModal();
            cart = []; // Empty cart after checkout
            updateCartCount();
            document.getElementById("orderForm").reset();
        }
    });
}


// Mobile Menu Toggle
function toggleMobileMenu() {
    const nav = document.getElementById('navbar');
    if (nav.classList.contains('active')) {
        nav.classList.remove('active');
    } else {
        nav.classList.add('active');
    }
}

// Menu Modal
function openMenuModal() {
    document.getElementById('viewMenuModal').style.display = 'flex';
}

function closeMenuModal() {
    document.getElementById('viewMenuModal').style.display = 'none';
}

// Close viewMenuModal when clicking outside
const originalWindowOnClick = window.onclick;
window.onclick = function(event) {
    if (originalWindowOnClick) originalWindowOnClick(event);
    if (event.target == document.getElementById('viewMenuModal')) closeMenuModal();
}
