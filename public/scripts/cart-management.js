const addToCartButtonElement = document.querySelector('#product-details button');
const cartBadgeElement = document.querySelector('.nav-items .badge');

function addToCart(){
    const productId = addToCartButtonElement.dataset.productid;
    const csrfToken = addToCartButtonElement.dataset.csrf;

    let response;
    try{
        response = await fetch('/cart/items',{
            method: 'POST',
            body: JSON.stringify({
                productId: productId,
                _csrf: csrfToken 
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    catch(error){
        alert('Something Went Wrong!');
    }
    
    if(!response.ok){
        alert('Something Went Wrong!');
    }

    const responseData = await response.json();
    const newTotalQuantity = responseData.newTotalItems;

    cartBadgeElement.textContent = newTotalQuantity;
}

addToCartButtonElement.addEventListener('click', addToCart);