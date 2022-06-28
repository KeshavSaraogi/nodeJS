const User = require('../models/user.model');
const authentication = require('../utilities/authentication');
const validation = require('../utilities/validation');
const sessionFlash =  require('../utilities/session-flash')

function getSignup(req,res){
    let sessionData = sessionFlash.getSessionData(req);

    if(!sessionData){
        sessionData = {
            email: '',
            confirmEmial: '',
            password: '',
            fullname: '',
            street: '',
            postal: '',
            city: ''
        };
    }
    res.render('customer/auth/signup', {inputData: sessionData});
}

async function signup(req,res, next){

    const enteredData = {
        email: req.body.email, 
        confirmEmail: req.body['confirm-email'],
        password: req.body.password, 
        fullname: req.body.fullname, 
        street: req.body.street, 
        postalCode: req.body.postal, 
        city: req.body.city
    }

    if(!validation.userDetailsAreValid(
        req.body.email, req.body.password, 
        req.body.fullname, req.body.street, 
        req.body.postal, req.body.city) ||
        !validation.emailIsConfirmed(req.body.email, req.body['confirm-email']))
    {
        sessionFlash.flashDataToSession(req, 
        {
            errorMessage: 'Please Check Your Input --> Invalid Credentials',...enteredData
        }, 
        function(){
            res.redirect('/signup');
        });
        return;
    }

    const user = new User(
        req.body.email, 
        req.body.password, 
        req.body.fullname, 
        req.body.street, 
        req.body.postal, 
        req.body.city
    );

    try{
        const existsAlready = await user.existsAlready();

        if(existsAlready){
            sessionFlash.flashDataToSession(req, {
                errorMessage: 'User Exists Already! Try Logging In Instead',...enteredData,
            }, function(){
                res.redirect('/signup');
            });
            return;
        }
        
        await user.signup();
    } catch(err){
        next(error);
        return;
    };
    res.redirect('/login');
}    

function getLogin(req,res){
    let sessionData = sessionFlash.getSessionData(req);
    
    if(!sessionData){
        sessionData = {
            email: '',
            password: ''
        };
    }

    res.render('customer/auth/login', {inputData: sessionData});
}

async function userLogin(req,res, next){
    const user = new User(req.body.email,req.body.password);
    let existingUser;
    try{
        existingUser = await user.compareEmail();
    } 
    
    catch(error){
        next(error);
        return;
    }

    const sessionErrorData = {
        errorMessage: 'Invalid Credentials -- Please Double Check Your Credentials', 
        email: user.email,
        password: user.password
    };
    
    if(!existingUser){
        sessionFlash.flashDataToSession(req, sessionErrorData, function(){
            res.redirect('/login');
        });
        return;
    }
    
    const matchingPasswords = await user.comparePassword(existingUser.password);
    if(!matchingPasswords){
        sessionFlash.flashDataToSession(req,sessionErrorData, function(){
            res.redirect('/login');
        });
        return;
    }

    authentication.createUserSession(req,existingUser, function(){
        res.redirect('/');
    });
}

function logout(req, res){
    authentication.destroyUserAuthenticationSession(req);
    res.redirect('/login');
}

module.exports = {
    getSignup: getSignup,
    getLogin: getLogin,
    signup: signup,
    userLogin: userLogin,
    logout: logout
};