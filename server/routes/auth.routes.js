const router = require('express').Router();
const {} = require('../controllers/auth.controller');

// routes/auth.js

const passport = require("passport");

// Google OAuth routes
router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
    })
);

router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
        res.redirect("/login");
    }
);

// Check authentication status
router.get("/current_user", (req, res) => {
    res.send(req.user);
});

// Logout
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
});

module.exports = router;

module.exports = router;
