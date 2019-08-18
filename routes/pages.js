const router = require("express").Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

// Index route
router.get("/", (req, res) => res.render("pages/index"));

// About route
router.get("/about", (req, res) => res.render("pages/about"));

// Login route
router.get("/login", (req, res) => res.render("pages/login"));

// Register route
router.get("/register", (req, res) => res.render("pages/register"));

// Load models
const User = require("../models/User");

// @route	POST /register
// @desc	Register an user account
// @access	Public
router.post("/register", (req, res) => {
    const { name, email, password, password2 } = req.body;
    const errors = [];
    User.findOne({ email }).then(user => {
        if (user) {
            errors.push({ text: "Email was registered" });
        }
        if (!name) {
            errors.push({ text: "Name is required" });
        }
        if (!email) {
            errors.push({ text: "Email is required" });
        }
        if (!password) {
            errors.push({ text: "Password is required" });
        }
        if (!password2) {
            errors.push({ text: "Confirm password is required" });
        }
        if (password != password2) {
            errors.push({ text: "Password not match" });
        }
        if (errors.length > 0) {
            res.render("pages/register", { name, email, errors });
        } else {
            const newUser = new User({ name, email, password });
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save().then(() => {
                        req.flash(
                            "success_msg",
                            "Account has been created, you can login now."
                        );
                        res.redirect("/login");
                    });
                });
            });
        }
    });
});

// @route	POST /login
// @desc	Login to user account
// @access	Public
router.post("/login", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/ideas",
        failureRedirect: "/login",
        failureFlash: true
    })(req, res, next);
});

// @router  POST /logout
// @desc    Logout from user account
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success_msg", "You're logged out");
    res.redirect("/login");
});

module.exports = router;
