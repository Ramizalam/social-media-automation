// get all accounts
//get /api/accounts
import {Response} from "express"
import { Account } from "../models/Account.js"
import { AuthRequest } from "../middleware/authMiddleware.js"
import zernio from "../config/zernio.js"

export const getAccount = async (req:AuthRequest,res:Response) : Promise<void> =>{
    try {
        const accounts = await Account.find({user:req.user._id})
        res.json(accounts)
    } catch (error) {
        console.error("Error in fetching accounts:",error)
        res.status(500).json({message:"Internal server error"})
    }
}

//Add Account
// POST /api/accounts

export const addAccount = async (req:AuthRequest, res:Response): Promise<void> => {
    try{
        const {platform,handle,avatarUrl} = req.body;
        const account = await Account.create({user: req.user._id, platform, handle, avatarUrl,status:"connected"})
        res.status(201).json(account)
    }catch (error){
        console.error("Error in adding account:", error)
        res.status(500).json({message:"Internal server error"})
    }
}

//Disconnect Account
//Delete /api/account/:id
export const disconnectAccount = async(req:AuthRequest,res:Response) : Promise<void> =>{
    try {
        const account = await Account.findOne({_id:req.params.id,user:req.user._id});
        if(!account){
            res.status(404).json({message:"Account Not found"})
            return
        }
        if(account.zernioAccountId){
            try {
                await zernio.accounts.deleteAccount({path:{accountId:account.zernioAccountId}})
                res.json({message:"Account Disconnected"})
            } catch (error) {
                console.error("Error disconnecting account",error)
                res.status(500).json({message:"Failed to disconnect account"})
            }
        }
        await account.deleteOne()
        res.json({message:"Account disconnected"})
    } catch (error) {
        console.error("Error in disconnecting account:", error);
        res.status(500).json({message:"Internal server error"})
    }

}