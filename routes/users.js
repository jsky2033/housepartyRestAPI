const router = require("express").Router();
const User = require("../models/User");

//update user, userId required
router.put("/:id", async (req, res) => {
  //check if correct user is being updated
  if (req.body.authId === req.params.id || req.body.isAdmin) {
    try {
      console.log(req.body);
      //update all inputs inside req body
      await User.findOneAndUpdate(
        { authId: req.params.id },
        { $set: req.body }
      );
      res.status(200).json("Account has been updated for " + req.params.id);
    } catch (err) {
      res.status(500).json(err.message);
    }
  } else {
    return res.status(403).json("You can update only your account!");
  }
});

//get a user
router.get("/getAll", async (req, res) => {
  try {
    //get user
    const users = await User.find({});

    const filtered_users = users.map((item) => {
      return {
        username: item.username,
      };
    });
    res.status(200).json(filtered_users);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

//get all users

module.exports = router;
