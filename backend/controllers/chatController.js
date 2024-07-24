const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const mongoose = require('mongoose');

exports.accessChat = async(req ,res) => {
    const {userId} = req.body;

    if (!userId) {
        console.log("UserId param not sent with request");
        return res.status(400).json({
            success:false,
            messsage:"User not found",
        });
    }

    // condition for finding one to one chat
    // isGroupChat : should be false and both users must be present in user 
    const chat = await Chat.find({
        isGroupChat:false,
        $and:[
            {users: {$elemMatch:{$eq:req.user.id}}},
            {users: {$elemMatch:{$eq:userId}}},
        ]
    }).populate('users', "-password").populate({
        path:"latestMessage",
        populate:{
            path:"sender",
            select:"name email"
        }
    });

    if(chat.length > 0){
        return res.status(200).json({
            success:true , 
            message:"Chat found",
            chat
        });
    }
    else{
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user.id, userId],
          };
          try {
            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
              "users",
              "-password"
            );
            res.status(200).json(FullChat);
          } catch (error) {
            res.status(400);
            throw new Error(error.message);
          }
    }
};

exports.fetchChats = async(req ,res) => {
    const allChats = await Chat.find( {users :{$elemMatch:{$eq:req.user.id}}}).populate('users' , '-password').populate('groupAdmin' , '-password').populate({
        path:'latestMessage',
        populate:{
            path:'sender',
            select:'name email'
        }
    }).sort({updatedAt:-1});
    return res.status(200).json({
        success:true,
        message:"Chats found",
        data:allChats
    });
}

exports.createGroupChat = async(req ,res) => {
    // important step :
    // we are sending an array string from frontend and parsing it into an object at backend 
    var users = JSON.parse(req.body.users);

    if (users.length < 2) {
        return res
        .status(400)
        .send("More than 2 users are required to form a group chat");
    }
    const admin = new mongoose.Types.ObjectId(req.user.id);
    // id.toObject();
    users.push(admin);

    try {
        const groupChat = await Chat.create({
          chatName: req.body.name,
          users: users,
          isGroupChat: true,
          groupAdmin: admin,
        });
    
        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
          .populate("users", "-password")
          .populate("groupAdmin", "-password");
        res.status(200).json(fullGroupChat);
      } catch (error) {
        res.status(400);
        throw new Error(error.message);
      }
}