// Register User
import bcrypt from "bcrypt";
import { User } from "../models/User.js";
import { Request, Response } from "express";
import generateToken from "../utils/generateToken.js";

// POST /api/auth/register
export const registerUser = async(req:Request,res:Response):Promise<void> =>{
    try{
        const{name,email,password}=req.body;
        const userExist = await User.findOne({email})
        if(userExist){
            res.status(400).json({message:"User already exists"})
            return
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt)

        const user = await User.create({name,email,password: hashedPassword})
        const token = generateToken({user._id,user.email});
    
        if(user){
            res.status(201).json({_id:user._id,name:user.name,email:user.email,token})
        }else{
            res.status(400).json({message:"Invalid user data"})
        }
    }
    catch(error){
        console.error("Error in user registration:",error)
        res.status(500).json({message:"Internal server error"})
    }
}

// Login User
// POST /api/auth/login
export const loginUser = async(req:Request,res:Response)=>{
    try{
        const {email,password} = req.body;

        const user = await User.findOne({email})
        if(!user){
            res.status(401).json({message:"Invalid email or password"})
            return
        }

        const isPasswordValid = await bcrypt.compare(password,user.password)
        if(!isPasswordValid){
            res.status(401).json({message:"Invalid email or password"})
            return
        }

        const token = generateToken({user._id,user.email})
        res.json({_id:user._id,name:user.name,email:user.email,token})

    }
    catch(error){
        console.error("Error in user login:",error)
        res.status(500).json({message:"Internal server error"})
    }
}