const deleteProductButtonElements = document.querySelectorAll('.product-item button');

async function deleteProduct(event){
    const buttonElement = event.target;
    const productId = butttonElement.dataset.productid;
    const csrfToken = buttonElement.dataset.csrfToken;

    const response = await fetch('/admin/proucts/' + productId + '?_csrf=' + csrfToken, {
        method = 'DELETE'
    });

    if(!response.ok){
        alert('Something Went Wrong!');
        return;
    };

    buttonElement.parentElement.parentElement.parentElement.parentElement.remove();
}

for (const deleteProductButtonElement of deleteProductButtonElements){
    deleteProductButtonElement.addEventListener('click', deleteProduct);
}