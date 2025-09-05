const express = require('express');
const router = express.Router();
const ownerModel = require('../models/owner-model');

router.get("/admin", function(req, res){
    let success = req.flash("success");
    res.render("createproducts", {success});
});

// let set the NODE_ENV process environment to development
// we can check is it set or not
//console.log(process.env.NODE_ENV);

if(process.env.NODE_ENV == "development"){
    router.post('/create', async (req, res) => {
        let owner = await ownerModel.find();
        if(owner.length > 0){
            res.status(503).send("You don't have permission to access.");
        }
        let {fullname, email, password} = req.body;

        let ownerCreated = await ownerModel.create({
            fullname, 
            email,
            password
        });
        res.status(201).send(ownerCreated);
    });
}

module.exports = router;



// If we set NODE_ENV variable to NODE_ENV=production 
// then the above route won't work and app throw err 
// cuz of the following reason in config folder 

/**
 * WARNING: NODE_ENV value of 'production' did not match any deployment config file names.
WARNING: See https://github.com/node-config/node-config/wiki/Strict-Mode
WARNING: No configurations found in configuration directory:/home/kunal/BagEcom/config
WARNING: To disable this warning set SUPPRESS_NO_CONFIG_WARNING in the environment.
production
Server running on the port 3000
 */