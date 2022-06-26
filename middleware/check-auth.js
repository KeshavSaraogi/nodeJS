function checkAuthentication(req,res,next){
    const uid = req.session.uid;
    if(!uid){
        return next();
    }
    res.locals.uid = uid;
    res.locals.isAuthenticated = true;
    next();
}

module.exports = checkAuthentication;