import { Server } from "socket.io";
import  Message  from "../models/message.model.js";

export const initializeSocket = (server) => {
	const io = new Server(server, {
		cors: {
			origin: ["http://localhost:3000", "https://5173-i5m8sa6b1m932pu9vwanb-bbce5f28.manusvm.computer"],
			credentials: true,
		},
	});

	const userSockets = new Map(); // { userId: socketId}
	const userActivities = new Map(); // {userId: activity}

	io.on("connection", (socket) => {
		console.log("🔗 User connected:", socket.id);

		socket.on("user_connected", (userId) => {
			console.log("👤 User connected with ID:", userId);
			userSockets.set(userId, socket.id);
			userActivities.set(userId, "Idle");

			// broadcast to all connected sockets that this user just logged in
			io.emit("user_connected", userId);

			socket.emit("users_online", Array.from(userSockets.keys()));

			io.emit("activities", Array.from(userActivities.entries()));
		});

		socket.on("update_activity", ({ userId, activity }) => {
			console.log("🎵 Activity updated:", userId, activity);
			userActivities.set(userId, activity);
			io.emit("activity_updated", { userId, activity });
		});

		socket.on("send_message", async (data) => {
			try {
				const { senderId, receiverId, content } = data;
				console.log("💬 Sending message:", { senderId, receiverId, content });

				const message = await Message.create({
					senderId,
					receiverId,
					content,
				});

				console.log("✅ Message created:", message);

				// send to receiver in realtime, if they're online
				const receiverSocketId = userSockets.get(receiverId);
				if (receiverSocketId) {
					console.log("📤 Sending to receiver:", receiverId);
					io.to(receiverSocketId).emit("receive_message", message);
				}

				// confirm to sender
				socket.emit("message_sent", message);
			} catch (error) {
				console.error("❌ Message error:", error);
				socket.emit("message_error", error.message);
			}
		});

		socket.on("disconnect", () => {
			console.log("🔌 User disconnected:", socket.id);
			let disconnectedUserId;
			for (const [userId, socketId] of userSockets.entries()) {
				// find disconnected user
				if (socketId === socket.id) {
					disconnectedUserId = userId;
					userSockets.delete(userId);
					userActivities.delete(userId);
					break;
				}
			}
			if (disconnectedUserId) {
				console.log("👋 Broadcasting user disconnection:", disconnectedUserId);
				io.emit("user_disconnected", disconnectedUserId);
			}
		});
	});
};

