import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export interface AuthRequest extends Request{
    user?: any;
}

export const protect  = async (req:AuthRequest,res:Response,next:NextFunction)=>{
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
       try {
         token = req.headers.authorization.split(" ")[1];
          const decode : any = jwt.verify(token,process.env.JWT_SECRET as string);
          req.user = await User.findById(decode.id).select('-password')
          next();
       } catch (error) {
        res.status(401).json({message:"Not Authorized",success:false})
       }
    }else{
        res.status(401).json({message:"Not Authorized Token not found"})
    }
}