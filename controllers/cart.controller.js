const Product = require('../models/product.model');

function getCart(req, res){
    res.render('customer/cart/cart');
}

function addCartItem(req, res, next){
    let product;
    try{
        product = await Product.findById(req.body.productId);
    }
    catch(error){
        next(error);
        return;
    }
    const cart = res.locals.cart;

    res.locals.cart.addItem(product);
    req.session.cart = cart;

    res.status(201).json({
        message: 'Cart Updated',
        totalItem: cart.totalQuantity
    });
}

module.exports = {
    addCartItem: addCartItem,
    getCart: getCart
};