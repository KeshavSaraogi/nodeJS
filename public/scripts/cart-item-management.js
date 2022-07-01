const cartItemUpdateFormelements = document.querySelectorAll('.cart-item-management');
const cartTotalPriceElement = document.getElementById('cart-total-price');
const cartbadge = document.querySelector('.nav-items .badge');

async function updateCartItem(event){
    event.preventDefault();

    const form = event.target;
    const productId = form.dataset.productid;
    const csrfToken = form.dataset.csrf;
    const quantity = form.firstElementChild.value;

    let response;

    try{
        response = await fetch('/cart/items', {
            method: 'PATCH',
            body: JSON.stringify({
                productId: productId,
                quantity: quantity,
                _csrf: csrfToken
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    catch(error){
        alert('Something Went Wrong!');
        return;
    }

    if(!response.ok){
        alert('Something Went Wrong!');
        return;
    }
    const responseData  = await response.json();

    if(responseData.updateCartData.updatedItemPrice === 0){
        form.parentElement.parentElement.remove();
    } else{
        const cartItemTotalPriceElement = form.parentElement.querySelector('.cart-item-price');
        cartItemTotalPriceElement.textContent = responseData.updatedCartData.updatedCartItem.updatedItemPrice.toFixed(2);
    }

   
    cartTotalPriceElement.textContent = responseData.updatedCartData.newTotalPrice.toFixed(2);
    cartBadge.textContent = reponseData.updatedCartData.newTotalQuantity;
}

for (const formElement of cartItemUpdateFormelements) {
    formElement.addEventListener('submit', updateCartItem);
}