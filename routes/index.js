var express = require("express");
var router = express.Router();
var userModel = require("../models/users");

/* GET home page. */
router.get("/", async function (req, res, next) {
  req.session.user = null;
  req.session.edit = null;
  const users = await userModel.find();

  const hiddingIntro = req.session?.intro ? true : false;

  res.render("index", { users, hiddingIntro });
});

router.get("/add-profile", async function (req, res, next) {
  req.session.intro = true;

  res.render("addprofile");
});

router.get("/delete-profile/:username", async function (req, res, next) {
  const user = await userModel.findOne({ username: req.params.username });

  if (!user) return res.redirect("/");

  res.render("deleteprofile", { username: req.params.username });
});

router.get("/edit", async function (req, res, next) {
  req.session.intro = true;
  const users = await userModel.find();

  res.render("editmenu", { users });
});

router.get("/edit-profile/:username", async function (req, res, next) {
  // req.session.edit = req.params.username;

  const user = await userModel.findOne({ username: req.params.username });

  if (!user) return res.redirect("/");

  res.render("editprofile", { user });
});

router.get("/search", async function (req, res, next) {
  if (!req.session?.user || req.session.user === null) return res.redirect("/");

  req.session.intro = true;

  const user = await userModel.findOne({ username: req.session.user });

  const list = user?.shows ? JSON.stringify(user?.shows) : undefined;

  res.render("search", {
    username: user.username,
    list,
    color: user.color,
    backgroundColor: user.backgroundColor,
    icon: user.icon,
    search: "",
    page: 1,
  });
});

router.post("/search", async function (req, res, next) {
  // if (!req.session?.user || req.session.user === null) return res.redirect("/");

  const user = await userModel.findOne({ username: req.session.user });

  const list = user?.shows ? JSON.stringify(user?.shows) : undefined;

  res.render("search", {
    username: user.username,
    list,
    color: user.color,
    backgroundColor: user.backgroundColor,
    icon: user.icon,
    search: req.body.search,
    page: req.body.page,
  });
});

router.get("/show/:search/:page/:id", async function (req, res, next) {
  console.log(req.session.user);
  if (!req.session?.user || req.session.user === null) return res.redirect("/");

  const user = await userModel.findOne({ username: req.session.user });

  const list = user?.shows ? JSON.stringify(user?.shows) : undefined;

  res.render("show", {
    id: req.params.id,
    username: user.username,
    list,
    color: user.color,
    backgroundColor: user.backgroundColor,
    icon: user.icon,
    search: req.params.search === "no_search" ? "" : req.params.search,
    page: req.params.page,
  });
});

//------------------------------ //
router.get("/login", function (req, res, next) {
  console.log(req.query.username);
  req.session.user = req.query.username;

  res.redirect("/search");
});

router.get("/confirm-delete/:username", async function (req, res, next) {
  await userModel.findOneAndDelete({ username: req.params.username });

  res.redirect("/");
});

router.get;

module.exports = router;
