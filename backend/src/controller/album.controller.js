import { Album } from '../models/album.model.js';

export const getAllAlbums = async (req, res,next) => {
    try {
        const albums = await Album.find();
        res.status(200).json(albums);
    } catch (error) {
        console.error('Error fetching albums:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}




export const getAlbumById = async (req, res,next) => {


}