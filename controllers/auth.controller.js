const User = require('../models/user.model');
const authentication = require('../utilities/authentication');

function getSignup(req,res){
    res.render('customer/auth/signup');
}

async function signup(req,res){
    const user = new User(
        req.body.email, 
        req.body.password, 
        req.body.fullname, 
        req.body.street, 
        req.body.postal, 
        req.body.city);
    await user.signup();
    res.redirect('/login');
}    

function getLogin(req,res){
    res.render('customer/auth/login');
}

function userLogin(req,res){
    const user = new User(req.body.email,req.body.password);
    const existingUser = await compareEmail();

    if(!existingUser){
        res.redirect('/login');
        return;
    }
    const matchingPasswords = await user.comparePassword(existingUser.password);
    if(!matchingPasswords){
        res.redirect('/login');
        return;
    }

    authentication.createUserSession(req,existingUser, function(){
        res.redirect('/');
    });
}

module.exports = {
    getSignup: getSignup,
    getLogin: getLogin,
    signup: signup
};