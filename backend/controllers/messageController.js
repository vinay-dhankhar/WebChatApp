const Message = require('../models/messageModel');
const User = require('../models/userModel');
const Chat = require('../models/chatModel');
const { default: mongoose } = require('mongoose');

exports.sendMessage = async(req , res) => {
    const {content , chatId } = req.body;

    if(!content || !chatId ){
        console.log("Invalid data in msg");    
        return res.status(500);
    }

    const chatID = new mongoose.Types.ObjectId(chatId);

    var newMessage = {
        sender : req.user.id,
        content:content,
        chat:chatID,
    }

    try{
        var msg = await Message.create(newMessage);

        msg = await msg.populate("sender" , "name");
        msg = await msg.populate("chat");
        msg = await User.populate(msg  , {
            path:"chat.users",
            select:"name email",
        });

        await Chat.findByIdAndUpdate(chatID , {
            latestMessage : msg,
        });

        res.status(200).json({
            success:true,
            message:"Message Updated",
            data : msg,
        });

    }
    catch(error){
        console.log(error);
    }
};

exports.allMessages = async(req , res) => {
    try {
        const {chatId}  = req.params;
        const messages = await Message.find({chat : chatId}).populate("sender","name email").populate({
            path:"chat",
            populate:{
                path:"users",
                select:"name email",
            },
        });
        res.status(200).json({
            success:true,
            data : messages,
        })
    } catch (error) {
        console.log(error);
    }
}