import Song from '../models/song.model.js';
import Album from '../models/album.model.js';

import { v2 as cloudinary } from "cloudinary";

// Cloudinary config
cloudinary.config({
  cloud_name: "dz0mno2r4",
  api_key:"491833532327491",
  api_secret:"-YzcntOfRCyLaEI-Z1Z1AY88tto",
});

const uploadCloudinaryFile = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "auto",
    });
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);
    throw new Error("Failed to upload file to Cloudinary");
  }
};


export const checkAdmin=async (req, res,next) => {
  
  res.status(200).json({admin:true});

}
export const createSong=async (req, res,next) => {
  try{
    if(!req.files||!req.files.audioFile||!req.files.imageFile)
    {
      return res.status(400).json({
        message: "Please provide both audio and image files"
      });
    }


    const {title, artist, albumId, duration} = req.body;

    const audioFile = req.files.audioFile;
    const imageFile = req.files.imageFile;
    const audioUrl = await uploadCloudinaryFile(audioFile);
    const imageUrl = await uploadCloudinaryFile(imageFile);

    const song=new Song({
      title,
      artist,
      audioUrl,
      imageUrl,
      albumId: albumId || null, // If albumId is not provided, set it to null
      duration,
      
    });

    await song.save();

    if(albumId)
    {
      await Album.findByIdAndUpdate(albumId,{
        $push: { songs: song._id }
      })
    }
    res.status(201).json({message: "Song created successfully",song});

  }
  catch(e)
  {
    console.log(e);
    next(e);
  }
}

export const deleteSong = async (req, res, next) => {
  try {
    const { id } = req.params;

    const song = await Song.findById(id);

    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    // Remove song reference from album if albumId exists
    if (song.albumId) {
      await Album.findByIdAndUpdate(song.albumId, {
        $pull: { songs: song._id },
      });
    }

    // Now delete the song
    await Song.findByIdAndDelete(id);

    res.status(200).json({ message: "Song deleted successfully", song });
  } catch (e) {
    console.log(e);
    next(e);
  }
};

export const createAlbum=async (req, res,next) => {
  try{
    if(!req.files||!req.files.imageFile)
    {
      return res.status(400).json({
        message: "Please provide an image file for the album"
      });
    }

    const {title, artist, releaseYear} = req.body;
    const imageFile = req.files.imageFile;
    const imageUrl = await uploadCloudinaryFile(imageFile);

    const album=new Album({
      title,
      artist,
      imageUrl,
      releaseYear,
    });

    await album.save();

    res.status(201).json({message: "Album created successfully", album});
  }
  catch(e)
  {
    console.log(e);
    next(e);
  }
}

export const deleteAlbum=async (req, res,next) => {
  try{
    const {id} = req.params;

    const album = await Album.findByIdAndDelete(id);

    if(!album)
    {
      return res.status(404).json({message: "Album not found"});
    }

    // Delete all songs associated with the album
    await Song.deleteMany({ albumId: album._id });

    res.status(200).json({message: "Album deleted successfully", album});
  }
  catch(e)
  {
    console.log(e);
    next(e);
  }
}



