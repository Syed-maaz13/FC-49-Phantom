const mongoose = require('mongoose');

const ConductorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    destinations: {
      type: Array,
      default: [],
    },
    sticker: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Conductor', ConductorSchema);
