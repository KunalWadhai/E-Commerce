const express = require('express');
const router = express.Router();
const passport = require('passport');
const {registerUser, loginUser, logoutUser, loginViaGoogle} = require('../controllers/authController');
const {generateToken} = require('../utils/generateToken');


router.get("/", function(req, res){
    res.send("All Is Well...Users!");
});

router.post("/register",registerUser); // --->controllers

router.post("/login", loginUser);

router.get("/logout", logoutUser);

// Google OAuth routes
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }), loginViaGoogle);

module.exports = router;
