export interface Song{
    _id:string;
    title:string;
    artist:string;
    albumId:string|null;
    imageUrl:string;
    audioUrl:string;
    duration:number;
    createdAt:string;
    updatedAt:Date;
}

export interface Album{
    _id:string;
    title:string;
    artist:string;
    imageUrl:string;
    realeaseYear:number;
    songs:Song[];
    
}


export interface Stats{
    totalSongs:number;
    totalAlbums:number;
    totalArtists:number;
    totalUsers:number;
}

export interface Message{
    _id:string;
    senderId:string;
    contentId:string;
    content:string;
    updatedAt:string;
    createdAt:string;
}