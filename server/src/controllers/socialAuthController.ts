import { Request, Response } from "express"
import zernio from "../config/zernio.js"
import { User } from "../models/User.js";
import { Account } from "../models/Account.js";
import { AuthRequest } from "../middleware/authMiddleware.js";

//Helper to ensure user has zernio Profile
const getOrCreateZernioProfile = async (user: any): Promise<string> => {
    try {
        const result = await zernio.profiles.listProfiles();
        const data = result.data as any;
        const profiles: any[] = Array.isArray(data) ? data : data?.profiles || data?.data || [];
        if (profiles.length > 0) {
            const pid = profiles[0]._id || profiles[0].id;
            await User.findByIdAndUpdate(user._id, { zernioProfileId: pid });
            return pid;
        }
        const createResult = await zernio.profiles.createProfile({
            body: { name: `${user.name || user.email} workspace` } as any
        });
        const created = (createResult.data as any)?.profile || createResult.data;
        const pid = created?._id || created?.id;
        if (!pid) {
            throw new Error("Failed to create zernio profile -no data Returned")
        }
        await User.findByIdAndUpdate(user._id, { zernioProfileId: pid })
        return pid;
    } catch (error: any) {
        console.error('getorCreateZernioProfile Error:', error?.message || error);
        throw error;
    }
}

//generate Oauth authorization url 

//GET /api/auth/:platform

export const generateAuthUrl = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { platform } = req.params;
        const profileId = await getOrCreateZernioProfile(req.user);
        const origin = req.headers.origin;
        const redirectUrl = `${origin}/accounts`;
        const result = await zernio.connect.getConnectUrl({
            path: { platform: platform as any },
            query: {
                profileId,
                redirect_url: redirectUrl
            }
        })
        const data = result.data as any;
        console.log("get connect url result ", JSON.stringify(data, null, 2));
        const authUrl = data.auth_url || data.connect_url || ""
        if (!authUrl) {
            throw new Error(`zernio return  no authURL  full response:${JSON.stringify(data)}`)
        }
        res.json({ url: authUrl })
    }
    catch (error: any) {
        console.error("Error generating auth url:", error)
        res.status(500).json({ message: error?.message || "Internal server error" })
    }
}

// Sync Connected Account from Zernio into MonogoDB

//GET /api/auth/sync
export const syncAccounts = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const profileId = await getOrCreateZernioProfile(req.user);
        const result = await zernio.accounts.listAccounts({
            query: {
                profileId
            } as any
        })
        const data = result.data as any;
        const zernioAccounts: any[] = Array.isArray(data) ? data : data?.accounts || data?.data || [];
        const supportedPlatforms = ["twitter", "linkedin", "facebook", "instagram", "X"];
        const syncedAccounts = [];
        for (const zAccount of zernioAccounts) {
            const zid = zAccount._id || zAccount.id;
            if (!zid) {
                console.warn("Skipping account with no ID", zAccount)
                continue;
            }
            const rawPlatform = (zAccount.platform || zAccount.type || "").toLowerCase();
            if (!rawPlatform) {
                console.warn("Skipping account with no platform", zAccount);
                continue;
            }
            // Normalize platform string (e.g. "x" -> "X", "twitter" -> "twitter")
            const normalizedPlatform = (
                rawPlatform === "x" ? "X" :
                    rawPlatform === "facebook_pages" ? "facebook" :
                        rawPlatform === "instagram_business" ? "instagram" : rawPlatform
            );

            // Only handle supported platforms
            if (!supportedPlatforms.includes(normalizedPlatform)) {
                console.log(`Skipping ${normalizedPlatform} account`, zAccount);
                continue;
            }
            const account = await Account.findOneAndUpdate({ zernioAccountID: zid }, {
                user: req.user._id,
                platform: normalizedPlatform,
                handle: zAccount.username || zAccount.name || zAccount.handle || "Unkown",
                zernioAccountId: zid,
                status: "connected",
                avatarUrl:zAccount.avatarUrl || zAccount.picture || zAccount.profile_image_url,

            },{upsert:true, returnDocument :'after'})
            syncedAccounts.push(account)
        }
        res.json(syncedAccounts)
    } catch (error:any) {
        res.status(500).json({message:error?.message || "error syncronizing accounts"})
    }
}