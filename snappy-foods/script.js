let cart = [];
const phoneOwner = "923017197577"; // Restaurant Owner's WhatsApp Number

function addToCart(itemName, priceData) {
    if (!priceData) priceData = { 'Regular': 0 };
    let optionsHtml = '';
    const sizes = Object.keys(priceData);
    
    if (sizes.length === 1) {
        optionsHtml = `<input type="hidden" id="swal-size" value="${sizes[0]}">
                       <p style="color: #ccc; margin-bottom: 15px;">Price: Rs. ${priceData[sizes[0]]}</p>`;
    } else {
        optionsHtml = `<select id="swal-size" class="swal2-input" style="width:80%; font-size:1rem;">`;
        sizes.forEach(s => {
            optionsHtml += `<option value="${s}">${s} (Rs. ${priceData[s]})</option>`;
        });
        optionsHtml += `</select>`;
    }

    Swal.fire({
        title: `Add ${itemName}`,
        html: `
            ${optionsHtml}
            <div style="margin-top:15px; display:flex; flex-direction:column; align-items:center;">
                <label for="swal-qty" style="color:#fff; margin-bottom:5px;">Quantity:</label>
                <input type="number" id="swal-qty" class="swal2-input" value="1" min="1" style="width: 50%; text-align: center;">
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Add to Cart',
        confirmButtonColor: '#e44d26',
        preConfirm: () => {
            const size = document.getElementById('swal-size').value;
            const qty = parseInt(document.getElementById('swal-qty').value);
            if (!qty || qty < 1) {
                Swal.showValidationMessage('Quantity must be at least 1');
            }
            return { size: size, qty: qty, price: priceData[size] };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            let res = result.value;
            let existing = cart.find(c => c.item === itemName && c.size === res.size);
            if(existing) {
                existing.qty += res.qty;
            } else {
                cart.push({ item: itemName, size: res.size, qty: res.qty, price: res.price });
            }
            
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
        let grandTotal = 0;
        cart.forEach((c, index) => {
            let itemTotal = c.price * c.qty;
            grandTotal += itemTotal;
            cartItemsDiv.innerHTML += `
                <div class="cart-item-row" style="display:flex; justify-content:space-between; align-items:center; padding:10px; border-bottom:1px solid rgba(255,255,255,0.1);">
                    <div style="flex-grow:1; text-align:left;">
                        <strong style="color:#fff;">${c.item}</strong>
                        ${c.size !== 'Regular' ? `<br><small style="color:var(--text-muted);">Size: ${c.size}</small>` : ''}
                        <br><small style="color:var(--text-muted);">Rs. ${c.price} x ${c.qty} = <strong>Rs. ${itemTotal}</strong></small>
                    </div>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <input type="number" min="1" value="${c.qty}" onchange="updateQty(${index}, this.value)" style="width: 60px; padding: 5px; border: 1px solid rgba(255,255,255,0.2); border-radius: 4px; background: rgba(0,0,0,0.5); color: #fff; text-align: center;">
                        <button onclick="removeItem(${index})" style="color:#ff4d4d; background:none; border:none; font-size:1.5rem; cursor:pointer;">&times;</button>
                    </div>
                </div>`;
        });
        
        cartItemsDiv.innerHTML += `
            <div style="text-align:right; margin-top:15px; font-size:1.3rem; color: var(--primary-color);">
                <strong>Grand Total: Rs. ${grandTotal}</strong>
            </div>
        `;
    }
    
    document.getElementById("viewMenuModal").style.display = "none";
    document.getElementById("cartModal").style.display = "flex";
}

function updateQty(index, newQty) {
    if(newQty < 1) newQty = 1;
    cart[index].qty = parseInt(newQty);
    openCartModal(); 
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCartCount();
    openCartModal(); 
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

function submitOrder(event) {
    event.preventDefault();
    
    const name = document.getElementById("fullName").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;
    const instructions = document.getElementById("instructions").value || "None";
    
    let itemsText = "";
    let sheetItemsText = "";
    let grandTotal = 0;
    cart.forEach(c => {
        let itemTotal = c.price * c.qty;
        grandTotal += itemTotal;
        itemsText += `- ${c.item} ${c.size !== 'Regular' ? '('+c.size+')' : ''} x${c.qty} = Rs.${itemTotal}%0A`;
        sheetItemsText += `- ${c.item} ${c.size !== 'Regular' ? '('+c.size+')' : ''} x${c.qty} = Rs.${itemTotal}\n`;
    });

    const waMessage = `*New Order - Snappy Foods*%0A%0A` +
                      `*Order Items:*%0A${itemsText}%0A` +
                      `*Grand Total: Rs. ${grandTotal}*%0A%0A` +
                      `*Customer Details:*%0A` +
                      `*Name:* ${name}%0A` +
                      `*Phone:* ${phone}%0A` +
                      `*Address:* ${address}%0A%0A` +
                      `*Instructions:* ${instructions}`;

    const waLink = `https://wa.me/${phoneOwner}?text=${waMessage}`;

    // Send data to Google Sheets instantly on form submit
    const sheetUrl = "https://script.google.com/macros/s/AKfycbyNcgsnDWHOTZkZ5VPPJXAvZcWh_WBnrHuOzecchv8vnvOiKbixKx3Bk-dagDF5xGTn/exec";
    fetch(sheetUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            phone: phone,
            address: address,
            items: sheetItemsText,
            total: grandTotal,
            instructions: instructions
        })
    }).catch(e => console.log('Sheet upload error:', e));

    Swal.fire({
        title: 'Order Ready to Send!',
        text: 'Your order details have been saved. You will now be redirected to WhatsApp to send your order.',
        icon: 'success',
        confirmButtonText: 'Proceed to WhatsApp',
        confirmButtonColor: '#28a745'
    }).then((result) => {
        if (result.isConfirmed) {
            window.open(waLink, '_blank');
            closeCheckoutModal();
            cart = []; 
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
    if (event.target == document.getElementById("cartModal")) closeCartModal();
    if (event.target == document.getElementById("checkoutModal")) closeCheckoutModal();
}
