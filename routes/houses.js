const router = require("express").Router();
const House = require("../models/House");

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

module.exports = router;
