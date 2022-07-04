const path = require('path');
const express = require('express');
const csrf = require('csurf');
const expressSession =  require('express-session');

const db = require('./data/database');
const authRoutes = require('./routes/auth.routes');
const productsRoutes = require('./routes/products.routes');
const baseRoutes = require('./routes/base.routes');
const adminRoutes = require('./routes/admin.routes');
const orderRoutes = require('./routes/order.routes');
const cartRoutes = require('./routes/cart.routes');
const addcsrfTokenMiddleware = require('./middleware/csrf-token');
const errorHandlerMiddleWare = require('./middleware/error-handler');
const checkAuthenticationMiddleware = require('./middleware/check-auth');
const protectRoutesMiddleware = require('./middleware/protect-routes');
const cartMiddleware = require('./middleware/cart');
const updatePricesMiddleware = require('./middleware/update-cart-prices');
const createSessionConfig = require('./config/session');


const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use('/products/assets',express.static('product-data'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//const sessionConfig = createSessionConfig();
//app.use(expressSession(sessionConfig));

app.use(expressSession({
    secret: 'super-secret',
    resave: false,
    saveUninitialized: false
}));

app.use(csrf());
app.use(cartMiddleware);
app.use(updatePricesMiddleware);
app.use(addcsrfTokenMiddleware);
app.use(checkAuthenticationMiddleware);

app.use(baseRoutes);
app.use(authRoutes);
app.use(productsRoutes);

app.use('/cart', cartRoutes);
app.use(protectRoutesMiddleware);

app.use('/orders',orderRoutes);
app.use('/admin', adminRoutes);
app.use(errorHandlerMiddleWare);

db.connectToDatabase().then(function(){
    app.listen(3000);
    }).catch(function(error){
    console.log('Failed To Connect to Database');
    console.log(error);
});
