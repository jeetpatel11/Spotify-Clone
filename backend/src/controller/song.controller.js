import  Song  from '../models/song.model.js';

export const getAllSongs = async (req, res,next) => {
    try {
        const songs = await Song.find().sort({createdAt:-1});
        res.status(200).json(songs);
    } catch (error) {
        next(error);
    }

}


export const getFeaturedSongs = async (req, res,next) => {
    try{
        const songs=await Song.aggregate([
            {
                $sample: { size: 6 } // Randomly select 10 songs
            },
            {
                $project: {
                    id: 1,
                    title: 1,
                    artist: 1,
                    imageUrl: 1,
                    audioUrl: 1
                 } // Sort by creation date in descending order
            }
        ]);
        res.status(200).json(songs);
    }
    catch (error) {
        next(error);
    }
}


export const getMadeForYou = async (req, res,next) => {
 try{
        const songs=await Song.aggregate([
            {
                $sample: { size: 4 } // Randomly select 10 songs
            },
            {
                $project: {
                    id: 1,
                    title: 1,
                    artist: 1,
                    imageUrl: 1,
                    audioUrl: 1
                 } // Sort by creation date in descending order
            }
        ]);
        res.status(200).json(songs);
    }
    catch (error) {
        next(error);
    }

}


export const getTrending = async (req, res,next) => {


     try{
        const songs=await Song.aggregate([
            {
                $sample: { size: 6 } // Randomly select 10 songs
            },
            {
                $project: {
                    id: 1,
                    title: 1,
                    artist: 1,
                    imageUrl: 1,
                    audioUrl: 1
                 } // Sort by creation date in descending order
            }
        ]);
        res.status(200).json(songs);
    }
    catch (error) {
        next(error);
    }


}
