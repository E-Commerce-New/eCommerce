// config/passport.js

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
//const mongoose = require("mongoose");
const User = require("../models/user");

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:5000/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const existingUser = await User.findOne({ googleId: profile.id });
                if (existingUser) {
                    return done(null, existingUser);
                }
                const user = new User({ googleId: profile.id });
                await user.save();
                done(null, user);
            } catch (err) {
                done(err, null);
            }
        }
    )
);
