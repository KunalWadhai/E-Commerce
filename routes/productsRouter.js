const express = require('express');
const router = express.Router();

router.get("/", function(req, res){
    res.send("All Is Well...Products!");
});

module.exports = router;
