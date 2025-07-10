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
    recipientId(recipientId: any, arg1: Message[]): unknown;
    _id:string;
    senderId:string;
    contentId:string;
    receiverId:string;
    content:string;
    updatedAt:string;
    createdAt:string;
}


export interface User{
    _id:string;
    clerkId:string;
    fullName:string;
    imageUrl:string;
}