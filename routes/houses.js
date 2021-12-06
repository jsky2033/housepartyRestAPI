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
        rent: req.body.rent,
        geoCode: req.body.geoCode,
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
        geoCode: house.geoCode,
        rent: house.rent,
        dbIdHouse: house._id,
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

//get overview of house from non-user
router.get("/houseOverview/:dbId", async (req, res) => {
  try {
    //GET OWNER DATA
    const owner = await User.findById(req.params.dbId);
    const authId = owner.authId;

    //GET HOUSE DATA
    const house = await House.findOne({ authId: authId });
    let filtered_house = {};
    let filtered_house_info = {};

    //GET DATA ABOUT HOUSEMATES
    let filtered_houseMates = [];

    //get housemates only if house exists
    if (house) {
      const houseMates = await User.find({
        _id: { $in: house.housemates }, // this gets a list of User documents whose _id field matches anything inside house.housemates []
      });

      //housemates
      filtered_houseMates = houseMates.map((item) => {
        return {
          username: item.username,
          phone: item.phone,
          membership: item.membership,
          dbId: item._id,
        };
      });

      //house description
      filtered_house["description"] = house.description;
      filtered_house["address"] = house.address;
      filtered_house["zipCode"] = house.zipCode;
      filtered_house["rent"] = house.rent;

      //house information
      if (house.information) {
        let house_info = house.information;
        house_info["_id"] = null;
        filtered_house_info = house_info;
      }
    }

    res.status(200).json({
      owner: {
        username: owner.username,
        phone: owner.phone,
      },
      house: filtered_house,
      housemates: filtered_houseMates,
      information: filtered_house_info,
      dbIdHouse: house._id,
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// get a list of all house geoCodes
router.get("/geoCode/getAll", async (req, res) => {
  try {
    const geoCodes = await House.find(
      {},
      {
        geoCode: 1,
        _id: 0,
      }
    );
    res.status(200).json(geoCodes);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// get a house based on geoCode
router.get("/geoCode/getByLoc", async (req, res) => {
  try {
    const searchCode = {
      "geoCode.lat": parseFloat(req.query.lat),
      "geoCode.lng": parseFloat(req.query.lng),
    };
    //get house if it exists
    const house = await House.findOne(searchCode, {
      description: 1,
      address: 1,
      zipCode: 1,
      geoCode: 1,
      housemates: 1,
      authId: 1,
    });
    const new_id = house.authId;
    //get owner of the house (their dbId is required for the frontend)
    const owner = await User.findOne({ authId: new_id });
    if (house) {
      res.status(200).json({
        house: {
          description: house.description,
          address: house.address,
          zipCode: house.zipCode,
          geoCode: house.geoCode,
          housemates: house.housemates,
          rent: house.rent,
          dbId: owner._id,
        },
      });
    } else {
      res.status(200).json(null);
    }
  } catch (err) {
    res.status(500).json(err.message);
  }
});

module.exports = router;
