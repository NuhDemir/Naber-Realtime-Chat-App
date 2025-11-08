import User from "../models/user.model.js";
console.log("[mod] message.controller.js loaded");
import Message from "../models/message.model.js";

import cloudinary from "../lib/cloudinary.js";
// Lazy import socket helpers inside the function to avoid circular imports
// (socket -> app -> routes -> controller -> socket) which can cause
// module initialization problems during deploy.

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      // Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    // Import socket helpers lazily to prevent circular import issues
    try {
      const socketMod = await import("../lib/socket.js");
      const receiverSocketId = socketMod.getReceiverSocketId(receiverId);
      if (receiverSocketId && socketMod.io) {
        socketMod.io.to(receiverSocketId).emit("newMessage", newMessage);
      }
    } catch (socketErr) {
      // Don't fail the request if socket import fails; just log it.
      console.error("Socket emit failed:", socketErr?.message || socketErr);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
