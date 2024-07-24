const mongoose = require("mongoose");
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const generateToken = require('../config/jwtToken');

exports.signup = async(req , res) => {
    // console.log("Req is : ");
    // console.log(req.body);
    const {name , email , password} = req.body;
    const userExists = await User.findOne({email});

    if(userExists){
        return res.status(500).json({
            success:false,
            message:"User exists",
        });
    }

    // try{
        const hashedPwd = await bcrypt.hash(password , 10);
        console.log("New pwd :" , hashedPwd);
    // }
    // catch(err){
        // console.log( "Error in hashing "  , err);
    // }

    const user = await User.create({name, email , password:hashedPwd});
    // console.log(user);

    if(user){
        res.status(200).json({
            success:true,
            message:"User Created",
            name:user.name,
            email:user.email,
            _id:user._id,
            token:generateToken(user._id),
        })
    }
}

exports.login = async(req ,res) => {
    const {email , password} = req.body;
    // console.log(email , password);
    const user = await User.findOne({email});
    // console.log(user);

    if(user){
        const newP = bcrypt.compare(password , user.password);
        if(newP){
            res.status(200).json({
                success:true,
                message:"Logged In",
                name:user.name,
                email:user.email,
                _id:user._id,
                token:generateToken(user._id),
            })
        }
    }
}


exports.allUsers = async(req , res)=>{
    const keyword = req.query.search ? {
        $or :[
            {name:{$regex :req.query.search , $options:"i" }},
            {email:{$regex :req.query.search , $options:"i" }},
        ],
    } : {};

    // console.log("Keyword" , keyword);

    // console.log(req.query);

    const users = await User.find(keyword).find({_id: { $ne : req.user.id}}).select('-password');
    // res.send(users);
    res.status(200).json({
        success:true,
        message:"Users Fetched",
        data:users
    });
}