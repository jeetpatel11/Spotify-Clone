// auth.middleware.js
import { clerkClient } from '@clerk/clerk-sdk-node';

export const protectRoute = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized - No token provided' });
    }

    const token = authorization.split(' ')[1];
    const payload = await clerkClient.verifyToken(token); // Verify with Clerk
    req.auth = () => payload; // Set req.auth for downstream use
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized - You must be logged in to access this route' });
  }
};

export const requireAdmin = async (req, res, next) => {

    try{
    const currentUser = await clerkClient.users.getUser(req.auth.userId);
    const isAdmin = process.env.ADMIN_EMAILS===currentUser.primaryEmailAddress.emailAddress;

    if(!isAdmin)
    {
      return  res.status(403).json({
            message: "Forbidden - You do not have permission to access this route"
        });
    }



    next();

    }
    catch (error) {
    console.error("Error fetching user:", error);
    }

}