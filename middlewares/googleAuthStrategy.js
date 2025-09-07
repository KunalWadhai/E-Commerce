
const userModel = require("../models/user-model");


module.exports = async function(accessToken, refreshToken, profile, done) {
    try {
      let existingUser = await userModel.findOne({ googleId: profile.id });
      if (existingUser) {
        return done(null, existingUser);
      }
      // If user with googleId not found, check if user with same email exists
      let userByEmail = await userModel.findOne({ email: profile.emails[0].value });
      if (userByEmail) {
        userByEmail.googleId = profile.id;
        await userByEmail.save();
        return done(null, userByEmail);
      }
      // Create new user
      const newUser = new userModel({
        googleId: profile.id,
        fullname: profile.displayName,
        email: profile.emails[0].value,
        picture: profile.photos[0].value
      });
      await newUser.save();
      done(null, newUser);
    } catch (err) {
      done(err, null);
    }
  }