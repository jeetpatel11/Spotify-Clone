import { clerkClient } from "@clerk/express";


export const protectRoute = async (req, res, next) => {
    
    if(!req.auth.userId)
    {
        return  res.status(401).json({
            message: "Unauthorized - You must be logged in to access this route"
        });

    }
     next();
        

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