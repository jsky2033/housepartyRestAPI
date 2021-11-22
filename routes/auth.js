const router = require("express").Router();
const User = require("../models/User");

//REGISTER
//create user
router.post("/register", async (req, res) => {
  try {
    const newUser = await new User({
      authId: req.body.authId,
      username: req.body.username,
      email: req.body.email,
      phone: req.body.phone,
      membership: req.body.membership,
    });

    const user = await newUser.save();

    res.status(200).json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).json(err.message);
  }
});

//LOGIN
//login is handled directly at the frontend with firebase

module.exports = router;
