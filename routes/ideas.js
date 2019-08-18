const router = require("express").Router();
const { ensureAuthenticated } = require("../config/auth");

// Load models
const Idea = require("../models/Idea");

// @route	GET /ideas
// @desc	Show all ideas
// @access
router.get("/", ensureAuthenticated, (req, res) => {
    const user = req.user.id;
    Idea.find({ user }).then(ideas => {
        res.render("ideas/index", { ideas });
    });
});

// @route	POST /ideas
// @desc	Create an idea
// @access
router.post("/", ensureAuthenticated, (req, res) => {
    const { title, detail } = req.body;
    const user = req.user.id;
    let errors = [];

    if (!title) {
        errors.push({ text: "Please add a title" });
    }
    if (!detail) {
        errors.push({ text: "Please add a detail" });
    }
    if (errors.length > 0) {
        res.render("ideas/add", { errors, title, detail });
    } else {
        new Idea({ user, title, detail })
            .save()
            .then(() => res.redirect("/ideas"));
    }
});

// @route	PUT /ideas
// @desc	Update an idea
// @access
router.put("/:id_idea", ensureAuthenticated, (req, res) => {
    const { title, detail } = req.body;
    let errors = [];
    Idea.findById(req.params.id_idea).then(idea => {
        if (!idea) {
            errors.push({ text: "Idea not found" });
            res.render("ideas/index", { errors });
        }
        if (!title) {
            errors.push({ text: "Please fill the title" });
        }
        if (!detail) {
            errors.push({ text: "Please fill the detail" });
        }
        if (errors.length > 0) {
            req.flash("error_msg", errors);
            res.redirect("back");
            // res.render("ideas/edit/" + req.params.id_idea, {
            //     errors,
            //     title,
            //     detail
            // });
        } else {
            idea.title = title;
            idea.detail = detail;
            idea.save().then(() => {
                req.flash("success_msg", "Idea updated");
                res.redirect("/ideas");
            });
        }
    });
});

// @route	DELETE /ideas
// @desc	Remove an idea
// @access
router.delete("/:id_idea", ensureAuthenticated, (req, res) => {
    const success = [];
    Idea.findOneAndDelete({ _id: req.params.id_idea }).then(() => {
        success.push({ text: "Success delete an idea" });
        req.flash("success_msg", "Success delete an idea");
        res.redirect("/ideas");
    });
});

// @route	GET /ideas/add
// @desc	Add idea form
// @access
router.get("/add", ensureAuthenticated, (req, res) => res.render("ideas/add"));

// @route	GET /ideas/edit
// @desc	Edit idea form
// @access
router.get("/edit/:_id", ensureAuthenticated, (req, res) => {
    Idea.findById(req.params._id).then(idea => {
        const { _id, title, detail } = idea;
        res.render("ideas/edit", { _id, title, detail });
    });
});

module.exports = router;
