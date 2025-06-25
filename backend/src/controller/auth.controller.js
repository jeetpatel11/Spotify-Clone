import User from "../models/user.model.js";

export const authCallback = async (req, res, next) => {
  try {
    const { id, firstName, lastName, imageUrl, token } = req.body;

    const user = await User.findOne({ clerkId: id });

    if (!user) {
      await User.create({
        clerkId: id,
        fullName: `${firstName} ${lastName}`,
        imageUrl: imageUrl
      });
    }

    // ✅ Set the token in cookie
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'Lax',
      secure: false // true only on HTTPS in production
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error in callback:", error);
    next(error);
  }
};
