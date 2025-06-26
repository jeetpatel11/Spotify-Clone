import { Server } from "socket.io";
import {Message} from '../models/message.model.js'


export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "https://localhost:3000",
      credentials: true,
    }
  });
2
  const userSockets=new Map();
  const userActivities=new Map();

  io.on("connection", (socket) => {
    socket.on("user_connected",(userId)=>{
      userSockets.set(userId,socket);
      userActivities.set(userId,"Idle");

      io.emit("user_connected",userId);

      socket.emit("user_online",Array.from(userActivities.keys()));

      io.emit("user_activity",Array.from(userActivities.entries()));
    })

    socket.on("user_activity",(userId,activity)=>{
      userActivities.set(userId,activity);
      io.emit("activity_updated",{userId,activity});
    })

    socket.on("send_message",async (messageData)=>{
       try{
        const {senderId,receiverId,content}=messageData;
       const newMessage=await Message.create
       ({
        senderId
        ,receiverId
        ,content});
        const receiverSocket=userSockets.get(receiverId);
        if(receiverSocket)
        {
          io.to(receiverId).emit("receive_message",newMessage);

        }
        socket.emit("message_sent",newMessage);
       }
       catch(e)
       {
        console.log(e);
        socket.emit("message_error","Failed to send message");
       }
    })

    socket.on("disconnect",()=>{
      let disconnectedUserId;
      for(const [userId,socketId] of userSockets.entries())
      {
        if(socketId===socket.id)
        {
          disconnectedUserId=userId;
          userSockets.delete(userId);
          userActivities.delete(userId);
          break;
        }

        if(disconnectedUserId)
        {
          io.emit("user_disconnected",disconnectedUserId);
          io.emit("user_activity",Array.from(userActivities.entries()));
        }
      }
    })
  })
}