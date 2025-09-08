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
    let user = await userModel.findOne({email: req.user.email});
    let productId = req.params.product_id;
    let cartItem = user.cart.find(item => item.product === productId);
    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        user.cart.push({ product: productId, quantity: 1 });
    }
    await user.save();
    req.flash("success", "Product added to the cart.");
    res.redirect("/shop");
});

router.get('/cart', isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({email : req.user.email}).populate("cart.product");
    let totalBill = 0;
    user.cart.forEach((cartItem) => {
        if (!cartItem.product) return; // skip if product is undefined/null
        let item = cartItem.product;
        let discountOnProduct = ((item.price * item.discount) / 100);
        let discountedProductPrice = item.price - discountOnProduct;
        totalBill += discountedProductPrice * cartItem.quantity;
    });
    console.log(totalBill);
    res.render("cart", {user, totalBill});
});

router.post('/cart/update/:product_id', isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({email : req.user.email});
    let productId = req.params.product_id;
    let cartItem = user.cart.find(item => item.product === productId);
    if (!cartItem) {
        return res.redirect('/cart');
    }
    if (req.body.name === "increase") {
        cartItem.quantity += 1;
    } else if (req.body.name === "decrease") {
        if (cartItem.quantity > 1) {
            cartItem.quantity -= 1;
        } else {
            // Remove item if quantity goes below 1
            user.cart = user.cart.filter(item => item.product !== productId);
        }
    }
    await user.save();
    res.redirect("/cart");
});

router.post('/cart/remove/:product_id', isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({email : req.user.email});
    let productId = req.params.product_id;
   // user.cart = user.cart.filter(item => item.product !== productId);
    user.cart.pop();
    await user.save();
    res.redirect("/cart");
})

module.exports = router;