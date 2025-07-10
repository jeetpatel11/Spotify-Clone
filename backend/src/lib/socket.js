import { Server } from "socket.io";
import Message from "../models/message.model.js";

export const initializeSocket = (server) => {
	const io = new Server(server, {
		cors: {
			origin: [
				"http://localhost:3000",
				"https://spotifyappa.netlify.app",
			],
			credentials: true,
		},
	});

	const userSockets = new Map();      // { userId: socketId }
	const userActivities = new Map();   // { userId: activity }

	io.on("connection", (socket) => {
		console.log("🔗 Socket connected:", socket.id);

		// Handle user connection
		socket.on("user_connected", (userId) => {
			console.log("👤 User connected:", userId);
			userSockets.set(userId, socket.id);
			userActivities.set(userId, "Idle");

			// Broadcast to others
			io.emit("user_connected", userId);
			socket.emit("users_online", Array.from(userSockets.keys()));
			io.emit("activities", Array.from(userActivities.entries()));
		});

		// Update activity
		socket.on("update_activity", ({ userId, activity }) => {
			console.log("🎵 Activity:", userId, activity);
			userActivities.set(userId, activity);
			io.emit("activity_updated", { userId, activity });
		});

		// Send message
		socket.on("send_message", async ({ senderId, receiverId, content }) => {
			try {
				console.log("💬 Message from", senderId, "to", receiverId);

				const message = await Message.create({ senderId, receiverId, content });

				const receiverSocketId = userSockets.get(receiverId);
				if (receiverSocketId) {
					io.to(receiverSocketId).emit("receive_message", message);
				}

				socket.emit("message_sent", message);
			} catch (error) {
				console.error("❌ Error sending message:", error);
				socket.emit("message_error", error.message);
			}
		});

		// Handle disconnect
		socket.on("disconnect", () => {
			let disconnectedUserId = null;
			for (const [userId, socketId] of userSockets.entries()) {
				if (socketId === socket.id) {
					disconnectedUserId = userId;
					userSockets.delete(userId);
					userActivities.delete(userId);
					break;
				}
			}
			if (disconnectedUserId) {
				console.log("🔌 User disconnected:", disconnectedUserId);
				io.emit("user_disconnected", disconnectedUserId);
			}
		});
	});
};
