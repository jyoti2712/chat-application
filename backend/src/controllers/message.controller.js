import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSideBar = async (req, res) => {
    try{
        const loggedInUser = req.user._id;
        const filteredUsers = await User.find({_id: { $ne: loggedInUser }}).select("-password");
        return res.status(200).json(filteredUsers);
    }
    catch(err){
        console.log("Error in getUsersForSideBar" , err.message);
        return res.status(500).json({message: "Internal server error"});
    }
}

export const getMessages = async(req, res) => {
    try{
        const { id:userToChatId } =  req.params
        const myId = req.user._id;
        const messages = await Message.find({
            $or: [
                {senderId: myId, receiverId: userToChatId},
                {senderId: userToChatId, receiverId: myId}
            ]
        })
        res.status(200).json(messages);
    }
    catch(err){
        console.log("Error from getMessages" , err.message);
        return res.status(500).json({message: "Internal server error"})
    }
}

export const sendMessage = async (req, res) => {
    try{
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;
        let imageURL;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageURL = uploadResponse.secure_url;
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageURL,
        });
        await newMessage.save();
        // todo: realtime functionality using socket.io
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(200).json(newMessage);
    }
    catch(err) {
        console.log("Error in send Message controller", err.message);
        return res.status(500).json({message: "Internal server error"});
    }
}