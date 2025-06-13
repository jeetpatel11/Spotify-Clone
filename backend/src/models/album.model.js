import moongoose from 'mongoose';


const albumSchema = new moongoose.Schema({
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
    releaseYear: {
        type: Number,
        required: true,
    },
    songs: [{
        type: moongoose.Schema.Types.ObjectId,
        ref: "Song", // Reference to the Song model
        required: false,
    }],
}, {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
});

const Album = moongoose.model("Album", albumSchema);
export default Album;