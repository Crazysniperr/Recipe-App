import express from "express";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserModel } from "../models/Users.js";

const router = express.Router();



router.post("/register",async (req,res)=>{
    const {username, password} = req.body;//get username and password from the body ..i.e front-end

    const user = await UserModel.findOne({username});//use to find the user in the database

    if(user){
        return res.json({message: "User already exists!"});//check if the user is already in the database
    }

    const hashedPassword = await bcrypt.hash(password,10)//use to decrypt the password


    const newUser = new UserModel({username, password: hashedPassword});//to create the new user object using username and password
    await newUser.save(); //save the user objectin database

    res.json({message: "user registered"});
});



router.post("/login", async(req,res)=>{
    const {username, password} = req.body;//get username and password from the body ..i.e front-end

    const user = await UserModel.findOne({username});

    if(!user){
        return res.json({message: "User Doesn't exists!"});
    }
    const isPasswordValid = await bcrypt.compare(password,user.password);

    if(!isPasswordValid){
        return res.json({message: "Username or Password is Incorrect"})
    }

    const token = jwt.sign({id: user._id},"secret");
    res.json({token, userId: user._id});
    res.json({token});

});


export {router as UserRouter};


export const verifyToken = (req, res,next) => {
    const token = req.headers.authorization;
    if(token){
        jwt.verify(token,"secret",(err)=>{
            if(err) return res.sendStatus(403);
            next();
        });
    }
    else{
        res.sendStatus(401);

    }

}