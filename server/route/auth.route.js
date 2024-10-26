const express = require("express");
const Users = require("../model/user.model");
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { verifyuser } = require("../middleware/auth.middleware");
require("../config/passport");
const { fetchUserData } = require("../controller/auth.controller");

router.get(
  "/login/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/googleRedirect",
  passport.authenticate("google"),
  async (req, res) => {
    const users = {
      firstName: req.user.displayName,
      lastName: req.user.name.familyName,
      email: req.user.emails[0].value,
      provider: req.user.provider,
      imgURL: req.user.photos[0].value,
      lastLogin: Date.now(),
    };

    console.log("this is users  ", users);
    /* A function that checks if the user exists in the database. If it does, it returns the user. If it
  doesn't, it creates a new user. */

    await Users.findOne({ email: users.email }, async (err, user) => {
      // if (err) {
      //   done(err, false, {
      //     message: "Something went wrong with Google OAuth",
      //   });
      // }
      if (user) {
        // User already exists in our database
        console.debug("User already exists in our database");

        // Update the last login timestamp
        user.lastLogin = Date.now();

        Users(user).save();
        let token = jwt.sign(
          {
            data: users,
          },
          process.env.JWT_SECRET,
          { expiresIn: "24h" }
        ); // expiry in 24 hours
        res.cookie("jwt", token);
        res.redirect(process.env.CLIENT_AUTH_REDIRECT_URL_REQUEST_URL);
      } else {
        Users(users).save();

        let token = jwt.sign(
          {
            data: users,
          },
          process.env.JWT_SECRET,
          { expiresIn: "24h" }
        ); // expiry in 24 hours
        res.cookie("jwt", token);

        res.redirect(process.env.CLIENT_AUTH_REDIRECT_URL_REQUEST_URL);
      }
    });
  }
);
router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect(process.env.CLIENT_URL);
  });
});

router.get("/current_user", verifyuser, fetchUserData);

module.exports = router;
