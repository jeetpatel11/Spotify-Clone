export const getState= async (req, res, next) => {
try{
    

    const [totalSongs,totalUsers,totalAlbums]=await Promise.all([
      Song.countDocuments(),
      User.countDocuments(),
      Album.countDocuments(),

      Song.aggregate([
        {
          $unionWith:{
            coll:"albums",
            pipeline:[]
          }
        },
        {
          $group:{
            _id:"$artist"
          }
        },
        {
          $count:"count"
        }
      ])
    ]);

    res.status(200).json({
      totalSongs,
      totalUsers,
      totalAlbums,
      totalArtists:totalArtists[0]?.count || 0
    });
  }

  catch(e)
  {
    next(e);
  }

}