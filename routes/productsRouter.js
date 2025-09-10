const express = require('express');
const router = express.Router();
const upload = require("../config/multer-config");
const productModel = require("../models/product-model");

router.get("/", function(req, res){
    res.send("All Is Well...Products!");
});

router.post("/create", upload.single("image"), async (req, res) => {
    try{
        let {name, price, discount, bgcolor, panelcolor, textcolor, productquantity} = req.body;
        let product = await productModel.create({
            image : req.file.buffer,   // as of file's data is in the req.file part and image is in buffer form as it's been set.
            name : name,
            price : price,
            discount ,
            productquantity : productquantity,
            bgcolor,
            panelcolor,
            textcolor
        });
        req.flash("success", "Product created successfully");
        res.redirect("/owners/admin");
    }catch(err){
        res.send(err.message);
    }
})

module.exports = router;
