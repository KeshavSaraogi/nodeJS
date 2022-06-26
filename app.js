const path = require('path');
const express = require('express');
const csrf = require('csurf');
const expressSession =  require('express-session');

const db = require('./data/database');
const authRoutes = require('./routes/auth.routes');
const addcsrfTokenMiddleware = require('./middleware/csrf-token');
const errorHandlerMiddleWare = require('./middleware/error-handler');
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
app.use(errorHandlerMiddleWare);

app.use(authRoutes); 

db.connectToDatabase().then(function(){
    app.listen(3000);
}).catch(function(error){
    console.log('Failed To Connect to Database');
});
