import { AuthRequest } from "../middleware/authMiddleware.js";
import {Response} from "express"
import ActivityLog from "../models/ActivityLog.js";

export const getActivity = async (req: AuthRequest,res:Response):Promise<void> =>{
    try {
        const activities = await ActivityLog.find({user:req.user._id}).sort({createdAt:-1}).limit(10)
        .populate("relatedPost","content")
        res.json(activities)
    } catch (error) {
        console.error("Error in fetching activities:",error)
        res.status(500).json({message:"Internal server error"})
    }
}