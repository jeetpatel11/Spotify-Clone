// auth.middleware.js
import { clerkClient } from '@clerk/clerk-sdk-node';

export const protectRoute = async (req, res, next) => {
  try {
    let token;

    // First try Authorization header
    const { authorization } = req.headers;
    if (authorization && authorization.startsWith('Bearer ')) {
      token = authorization.split(' ')[1];
    }

    // Then try cookies (if Authorization header is missing)
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized - No token provided' });
    }

    const payload = await clerkClient.verifyToken(token);
    req.auth = () => payload;
    next();
  } catch (error) {
    console.error("❌ protectRoute error:", error);
    return res.status(401).json({ message: 'Unauthorized - You must be logged in to access this route' });
  }
};

export const requireAdmin = async (req, res, next) => {
  try {
    const userId = req.auth().sub;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized - Missing user ID" });
    }

    const user = await clerkClient.users.getUser(userId);
    const email = user?.emailAddresses?.[0]?.emailAddress;

    console.log("🟢 Admin email check:", email);

    if (email?.toLowerCase().trim() !== process.env.ADMIN_EMAIL.toLowerCase().trim()) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    req.user = { id: userId, email, role: "admin" };
    next();
  } catch (err) {
    console.error("❌ requireAdmin error:", err);
    return res.status(403).json({ message: "Admin verification failed" });
  }
};
