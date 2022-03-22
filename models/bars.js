
const mongoose = require("mongoose");

const BarSchema = new mongoose.Schema ({
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
        required: true
     },
     phoneNumber: {
        type: String,
        required: true
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

const Bars = mongoose.model("Bars", BarSchema);

module.exports = Bars;