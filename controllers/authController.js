const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const userModel = require('../models/user-model');
const {generateToken} = require('../utils/generateToken');

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended : true}));

module.exports.registerUser = async (req, res) => {
     try{
            let {email, password, fullname} = req.body;
            
            let user = await userModel.findOne({email : email});
            if(user){
                req.flash("error", "You already have an account, please login.");
                return res.redirect("/");
            }

            const saltRounds = 10;
            bcrypt.genSalt(saltRounds, (err, salt) => {
                bcrypt.hash(password, salt, async (err, hash) => {
                    if(err) res.send(err.message);
    
                    let user = await userModel.create({
                        fullname,
                        email,
                        password : hash
                    });

                   // let token = jwt.sign({email, id : user._id}, config.get("JWT_KEY"));
                    let token = generateToken(user);
                    console.log("jwt token", token);
                    res.cookie("token", token);
                    //res.send("User created successfully");
                    res.redirect("/");
                });
            });
           
        } catch(err){
            console.log(err.message);
        }
    
}

module.exports.loginUser = async (req, res) => {
    let {email, password} = req.body;

    let user = await userModel.findOne({email : email});

    if(!user){
        req.flash("error","Email Or Password may be incorrect..!")
        return res.redirect("/");
    }
    bcrypt.compare(password, user.password, (err, result) => {
        if(!result){
            req.flash("error", "Password is incorrect")
            return res.redirect("/");
        }else{
            let token = generateToken(user);
            console.log(token);
            res.cookie("token", token);
            res.send("User Login Successfully");
        }
    });
}

module.exports.logoutUser = (req, res) => {
    res.cookie("token", "");
    //res.send("User Logout");
    res.redirect("/");
}