const router = require("express").Router();
const House = require("../models/House");
const User = require("../models/User");

//create a house
router.post("/:id", async (req, res) => {
  //check if correct user is being updated
  if (req.body.authId === req.params.id || req.body.isAdmin) {
    try {
      const newHouse = new House({
        authId: req.body.authId,
        description: req.body.description,
        address: req.body.address,
        zipCode: req.body.zipCode,
      });

      const house = await newHouse.save();

      res.status(200).json(house);
    } catch (err) {
      res.status(500).json(err.message);
    }
  } else {
    return res.status(403).json("You cannot create a house for another user!");
  }
});

//get house information for user
router.get("/:id", async (req, res) => {
  try {
    //get house if it exists
    const house = await House.findOne({ authId: req.params.id });

    if (house) {
      res.status(200).json({
        description: house.description,
        address: house.address,
        zipCode: house.zipCode,
        information: house.information,
      });
    } else {
      res.status(200).json(null);
    }
  } catch (err) {
    res.status(500).json(err.message);
  }
});

//update house information

//update house
router.put("/:id", async (req, res) => {
  //check if correct user's house is being updated
  if (req.body.authId === req.params.id || req.body.isAdmin) {
    try {
      //update the main house document
      await House.findOneAndUpdate(
        { authId: req.params.id },
        { $set: req.body }
      );
      res.status(200).json("House has been updated for " + req.params.id);
    } catch (err) {
      console.log(err.message);
      res.status(500).json(err.message);
    }
  } else {
    return res.status(403).json("You can update only your house!");
  }
});

//add another user as housemate
router.put("/addUser/:dbId", async (req, res) => {
  //url has user being added
  //body has user doing the adding
  const currentHouse = await House.findOne({ authId: req.body.authId }); //house of adding user
  //check if user is trying to add themselves
  if (req.params.dbId !== req.body.dbId) {
    //check if house exists for this user
    if (currentHouse) {
      //check if other user is already a housemate
      if (!currentHouse.housemates.includes(req.params.dbId)) {
        try {
          //add user to housemate array
          await currentHouse.updateOne({
            $push: { housemates: req.params.dbId },
          });
          res.status(200).json("User has been added to house");
        } catch (err) {
          res.status(500).json(err.message);
        }
      } else {
        return res
          .status(403)
          .json("You already have this user as a housemate!");
      }
    } else {
      return res.status(403).json("You have not created a house yet");
    }
  } else {
    return res.status(403).json("You are already the owner of this house!");
  }
});

//get all housemates of user
router.get("/houseMates/:id", async (req, res) => {
  //url has user whose housemates are being accessed
  const currentHouse = await House.findOne({ authId: req.params.id }); //house of adding user
  //check if house exists for this user
  if (currentHouse) {
    try {
      //get array of user objects for these users
      const houseMates = await User.find({
        _id: { $in: currentHouse.housemates },
      });
      const filtered_houseMates = houseMates.map((item) => {
        return {
          username: item.username,
          phone: item.phone,
          membership: item.membership,
          dbId: item._id,
        };
      });
      res.status(200).json(filtered_houseMates);
    } catch (err) {
      res.status(500).json(err.message);
    }
  } else {
    return res.status(403).json("You have not created a house yet");
  }
});

//delete housemate of user
router.delete("/:dbId", async (req, res) => {
  //url has user being added
  //body has user doing the adding
  const currentHouse = await House.findOne({ authId: req.body.authId }); //house of adding user
  try {
    //add user to housemate array
    await currentHouse.updateOne({
      $pull: { housemates: req.params.dbId },
    });
    res.status(200).json("Housemate has been deleted");
  } catch (err) {
    res.status(500).json(err.message);
  }
});

module.exports = router;
