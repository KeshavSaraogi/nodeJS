const updateOrderFormElements = document.querySelectorAll('.order-actions fomr');

async function updateOrder(event){
    event.preventDefault();
    const form = event.target;

    const formData = new FormData(form);
    const newStatus = formData.get('status');
    const orderId = formData.get('orderid');
    const csrfToken = formData.get('csrftoken');

    let response;

    try{
        response = await fetch(`/admin/orders/${orderId}`,{
            method: 'PATCH',
            body: JSON.stringify({
                newStatus: newStatus,
                _csrf: csrfToken,
            }),
            headers: { 
                'Content-Type': 'application/json',
            },  
        });
    } catch (error){
        alert('Something Went Wrong -- Could Not Update Order Status');
        return;
    }

    if(!response.ok){
        alert('Something Went Wrong!');
        return;
    }

    const responseData = await response.json();

    form.parentElement.parentElement.removeChild.querySelector('.badge').textContent = responseData.newStatus.toUpperCase();
    
}

for (const updateOrderFormElement of updateOrderFormElements){
    updateOrderFormElement.addEventListener('submit', updateOrder);
}