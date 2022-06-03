var express = require("express");
var router = express.Router();
var userModel = require("../models/users");
// var uid2 = require("uid2");

router.post("/add", async function (req, res, next) {
  try {
    const newUser = await userModel.create({
      username: req.body.username,
      icon: req.body.icon,
      color: req.body.color,
      backgroundColor: req.body.backgroundColor,
      // token: uid2(6),
    });

    res.status(201).json({
      status: "success",
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
});

router.get("/infos/:username", async function (req, res, next) {
  try {
    const user = await userModel.findOne({ username: req.params.username });
    res.status(200).json({
      status: "success",
      data: {
        infos: user,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
});

router.get("/all", async function (req, res, next) {
  try {
    const users = await userModel.find();

    res.status(200).json({
      status: "success",
      results: users.length,
      data: {
        users,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
});

router.post("/shows", async function (req, res, next) {
  try {
    const user = await userModel.findOne({ username: req.body.username });

    user.shows = req.body.list;

    const userSaved = await user.save();

    res.status(201).json({
      status: "success",
      data: {
        user: userSaved,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
});

router.patch("/update", async function (req, res, next) {
  try {
    const user = await userModel.findOneAndUpdate(
      { username: req.body.user },
      {
        username: req.body.username,
        icon: req.body.icon,
        color: req.body.color,
        backgroundColor: req.body.backgroundColor,
      },
      {
        new: true,
        runValidators: true, // Thanks to that, the validators run again when we upadate a user( for example a password must have at least 8 characters)
      }
    );
    res.status(201).json({
      status: "success",
      data: {
        user: user,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
});

module.exports = router;
