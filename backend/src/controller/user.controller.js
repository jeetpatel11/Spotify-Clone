import { clerkClient } from '@clerk/clerk-sdk-node'; // Add if needed
import User from '../models/user.model.js';
import Message from '../models/message.model.js';

export const getAllUsers = async (req, res, next) => {
  try {
    const { userId } = req.auth(); // ✅ Call as a function

    const users = await User.find({ clerkId: { $ne: userId } });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try{
    const myId=req.auth.userId;
    const {id}=req.params;

    const messages=await Message.find({
      $or:[
        {senderId:id,receiverId:myId},
        {senderId:myId,receiverId:id}
      ] 
    }).sort({createdAt:1});

    res.status(200).json(messages);
  }
  catch(error)
  {
    next(error);
  }
}
