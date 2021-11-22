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
      console.log(err.message);
      res.status(500).json(err.message);
    }
  } else {
    return res.status(403).json("You can update only your account!");
  }
});

//get a user
router.get("/:id", async (req, res) => {
  try {
    //get user
    const user = await User.findOne({ authId: req.params.id });
    res.status(200).json({
      username: user.username,
      phone: user.phone,
      membership: user.membership,
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

router.get("/userOps/getAll", async (req, res) => {
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

module.exports = router;
