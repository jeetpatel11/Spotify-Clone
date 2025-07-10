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
  try {
    // Fix: Use req.auth() as a function, not as an object
    const myId = req.auth().sub; // Use .sub to get the user ID from Clerk
    const { id } = req.params; // This is the other user's ID

    console.log("🔍 Fetching messages between:", myId, "and", id);

    const messages = await Message.find({
      $or: [
        { senderId: id, receiverId: myId },
        { senderId: myId, receiverId: id }
      ] 
    }).sort({ createdAt: 1 });

    console.log("📨 Found messages:", messages.length);
    res.status(200).json(messages);
  } catch (error) {
    console.error("❌ Error fetching messages:", error);
    next(error);
  }
}

