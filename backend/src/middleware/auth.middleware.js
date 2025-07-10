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

    // Also try session token from cookies (common with Clerk)
    if (!token && req.cookies?.__session) {
      token = req.cookies.__session;
    }

    // Try clerk session token
    if (!token && req.cookies?.__clerk_session) {
      token = req.cookies.__clerk_session;
    }

    if (!token) {
      console.log("❌ No token found in request");
      return res.status(401).json({ 
        message: 'Unauthorized - No token provided',
        admin: false 
      });
    }

    console.log("🔍 Attempting to verify token with clock skew tolerance...");
    
    // Use verifyToken with clockSkewInMs to handle time synchronization issues
    const payload = await clerkClient.verifyToken(token, {
      clockSkewInMs: 30000, // Allow 30 seconds of clock skew (increased from default 5 seconds)
      // You can also add other options here if needed:
      // secretKey: process.env.CLERK_SECRET_KEY,
      // authorizedParties: ['http://localhost:3000', 'http://localhost:5173'] // Add your frontend URLs
    });
    
    if (!payload || !payload.sub) {
      console.log("❌ Invalid token payload");
      return res.status(401).json({ 
        message: 'Unauthorized - Invalid token',
        admin: false 
      });
    }

    console.log("✅ Token verified successfully for user:", payload.sub);
    req.auth = () => payload;
    next();
  } catch (error) {
    console.error("❌ protectRoute error:", error);
    
    // Provide more specific error messages
    let message = 'Unauthorized - You must be logged in to access this route';
    
    if (error.reason === 'token-iat-in-the-future') {
      message = 'Unauthorized - Token timestamp issue. Please try refreshing the page or logging in again.';
      console.log("⚠️ Clock skew detected - token issued in the future");
    } else if (error.message && error.message.includes('expired')) {
      message = 'Unauthorized - Token has expired, please log in again';
    } else if (error.message && error.message.includes('invalid')) {
      message = 'Unauthorized - Invalid token, please log in again';
    }
    
    return res.status(401).json({ 
      message,
      admin: false 
    });
  }
};

export const requireAdmin = async (req, res, next) => {
  try {
    const userId = req.auth().sub;

    if (!userId) {
      console.log("❌ Missing user ID in token");
      return res.status(401).json({ 
        message: "Unauthorized - Missing user ID",
        admin: false 
      });
    }

    console.log("🔍 Checking admin status for user:", userId);
    const user = await clerkClient.users.getUser(userId);
    const email = user?.emailAddresses?.[0]?.emailAddress;

    console.log("🟢 Admin email check:", email);
    console.log("🟢 Expected admin email:", process.env.ADMIN_EMAIL);

    if (!process.env.ADMIN_EMAIL) {
      console.error("❌ ADMIN_EMAIL environment variable not set");
      return res.status(500).json({ 
        message: "Server configuration error",
        admin: false 
      });
    }

    if (email?.toLowerCase().trim() !== process.env.ADMIN_EMAIL.toLowerCase().trim()) {
      console.log("❌ User is not admin:", email);
      return res.status(403).json({ 
        message: "Access denied. Admins only.",
        admin: false 
      });
    }

    console.log("✅ User verified as admin:", email);
    req.user = { id: userId, email, role: "admin" };
    next();
  } catch (err) {
    console.error("❌ requireAdmin error:", err);
    
    let message = "Admin verification failed";
    if (err.message && err.message.includes('User not found')) {
      message = "User not found in authentication system";
    }
    
    return res.status(403).json({ 
      message,
      admin: false 
    });
  }
};

