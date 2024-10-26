const passport = require("passport");
require("dotenv").config();
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8000/api/auth/googleRedirect",
    },
    async function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);

/* Serializing the user. */
passport.serializeUser(function (_id, done) {
  done(null, _id);
});

/* Taking the user id and finding the user in the database. */
passport.deserializeUser(function (_id, done) {
  done(null, _id);
});
