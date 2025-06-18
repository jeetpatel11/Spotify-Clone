import { clerkClient } from '@clerk/clerk-sdk-node'; // Add if needed
import User from '../models/user.model.js';

export const getAllUsers = async (req, res, next) => {
  try {
    const { userId } = req.auth(); // ✅ Call as a function

    const users = await User.find({ clerkId: { $ne: userId } });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};
