const path = require('path');
const express = require('express');
const csrf = require('csurf');
const expressSession =  require('express-session');

const db = require('./data/database');
const authRoutes = require('./routes/auth.routes');
const productsRoutes = require('./routes/products.routes');
const baseRoutes = require('./routes/base.routes');
const addcsrfTokenMiddleware = require('./middleware/csrf-token');
const errorHandlerMiddleWare = require('./middleware/error-handler');
const checkAuthenticationMiddleware = require('./middleware/check-auth');
const createSessionConfig = require('./config/session');

const app = express();
const sessionConfig = createSessionConfig();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.urlencoded({extended:false}));
app.use(expressSession(sessionConfig));

app.use(csrf());
app.use(addcsrfTokenMiddleware);
app.use(checkAuthenticationMiddleware);

app.use(authRoutes);
app.use(baseRoutes);
app.use(productsRoutes);
app.use(errorHandlerMiddleWare);

db.connectToDatabase().then(function(){
    app.listen(3000);
}).catch(function(error){
    console.log('Failed To Connect to Database');
});
