const jwt = require('jsonwebtoken');
const userModel = require('../models/user-model');


module.exports = async (req, res, next) => {
    // when cookie is not set that means user isn't logged in 
    // throw the message as flash.
    if(!req.cookies.token){
        req.flash("error", "You need to login first");
        return res.redirect("/");
    }

    try{
        let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
        // when we get user on the basis of email or whatever we'll get complete
        // user data in this case but we don't wanna password so we just exclude it.
        let user = await userModel.findOne({email : decoded.email}).select("-password");

        // created field as user in  request and put the data of above user we have fetch.
        req.user = user;

        // then go forward to the route from which it calls 
        next();
    } catch(err) {
        req.flash("error", "something went wrong..!");
        res.redirect("/");
    }
}