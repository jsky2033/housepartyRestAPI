const mongoose = require("mongoose");

const InformationSchema = new mongoose.Schema({
  poolDesc: {
    type: String,
  },
  gymDesc: {
    type: String,
  },
  kitchenDesc: {
    type: String,
  },
  laundryDesc: {
    type: String,
  },
  gardenDesc: {
    type: String,
  },
});

const GeoSchema = new mongoose.Schema({
  lat: {
    type: Number,
    required: true,
  },
  lng: {
    type: Number,
    required: true,
  },
});

const HouseSchema = new mongoose.Schema(
  {
    authId: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    rent: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
    housemates: {
      type: Array,
      default: [],
    },
    information: InformationSchema,
    geoCode: GeoSchema
  },
  { timestamps: true }
);

module.exports = mongoose.model("House", HouseSchema);
