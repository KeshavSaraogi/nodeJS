const Order = require('../models/order.model');
const User = require('../models/user.model');
const stripe = require('stripe')('sk_test_51LH4H5SBju0Uk5MfFFPdSEnLnzfRHCUEQ7gmEN88ca3qvJ0enjMkkf8Riuo2jxasAXZxybbb9tzsqHIohVDjOAmG00YkDg6FYL');

function getOrders(req, res){
    try{
        const orders = await Order.findAllForUser(res.locals.uid);
        res.redirect('customer/orders/all-orders', {
            orders: orders,
        });
    }
    catch(error){
        next(error);
    }
}

function addOrder(req, res, next){
    const cart = res.locals.cart;
    
    let userDocument;
    try{
        userDocument = await User.findById(res.locals.uid);
    }
    catch(error){
        next(error);
        return;
    }
   
    const order = new Order(cart, userDocument);
    
    try{
        order.save();
    } 
    catch(error){
        next(error);
        return;
    }

    req.sessions.cart = null;

    const session = await stripe.checkout.sessions.create({
        payment_method_types = ['card'],
        line_items: cart.items.map(function(item){
            return {
                price_data: {
                    currency: 'usd',
                    product_data:{
                        name: item.product.title
                    }, 
                    unit_amount: +item.product.price.toFixed(2) * 100
                },
                quantity: item.quantity,
            }
        }),
        mode: 'payment',
        success_url: `http://localhost:3000/orders/success`,
        cancel_url: `http://localhost:3000/orders/failure`,
    });
    res.redirect(303, session.url);
}

function getSuccess(req, res){
    res.render('customer/orders/success');
}

function getFailure(req, res){
    res.render('customer/orders/failure');
}


module.exports = {
    addOrder: addOrder,
    getOrders: getOrders,
    getSuccess: getSuccess,
    getFailure: getFailure
};