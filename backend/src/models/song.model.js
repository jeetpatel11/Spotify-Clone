import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  audioUrl: {
        type: String,
        required: true,
  },
  duration: {
    type: Number, // Duration in seconds
    required: true,
  },
  albumId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Album", // Reference to the Album model
    required: false,
  },
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt fields
});



const Song = mongoose.model("Song", songSchema);
export default Song;