const express = require('express');
const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn");
const productModel = require('../models/product-model');
const userModel = require("../models/user-model");


router.get("/", (req, res) => {
    let error = req.flash("error");
    res.render("index", {error});
});

router.get("/shop", isLoggedIn, async (req, res) => {
    let products = await productModel.find();
    let success = req.flash("success");
    res.render("shop", {products, success});
});

router.get("/addtocart/:product_id", isLoggedIn, async (req, res) => {
    //console.log(req.user);
    let user = await userModel.findOne({email: req.user.email});
    user.cart.push(req.params.product_id);
    await user.save();
    req.flash("success", "Product added to the cart.");
    res.redirect("/");
})

module.exports = router;