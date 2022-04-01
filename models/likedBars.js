
const mongoose = require("mongoose");

const LikedBarSchema = new mongoose.Schema({
   placeUrl: {
      type: String,
      required: true
   },
   title: {
      type: String,
      required: true
   },
   rating: {
      type: String,
      required: true
   },
    reviewCount: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    attributes: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    plusCode: {
        type: String,
        required: true
     },
     website: {
        type: String,
        required: false
     },
     phoneNumber: {
        type: String,
        required: false
     },
     currentStatus: {
        type: String,
        required: true
     },
     imgUrl: {
        type: String,
        required: true
     },
})

const LikedBars = mongoose.model("liked-bars", LikedBarSchema);

module.exports = LikedBars;