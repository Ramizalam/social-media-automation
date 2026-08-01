import cron from "node-cron"
import { Account } from "../models/Account.js"
import { Post } from "../models/Post.js"
import zernio from "../config/zernio.js"
import ActivityLog from "../models/ActivityLog.js"

export const initScheduler = () => {
    // Runs every minute
    cron.schedule("* * * * *", async () => {
        try{
        const now = new Date();
        const postToPublish = await Post.find({
            status: "scheduled",
            scheduledFor: { $lte: now },    //$lte means less than now 
        }).populate("user");

        for (const post of postToPublish) {
            try {
                const accounts = await Account.find({ user: post.user._id, platform: { $in: post.platform }, status: "connected", zernioAccountId: { $exists: true } })
                if (!accounts) {
                    console.log(`No connected Zernio account found for post ${post._id}`);
                    continue;
                }
                const zernioPlatforms = accounts.map((acc)=>({
                   tfrom : acc.platform  as any,
                   accountId : acc.zernioAccountId!
                }))

                const payload ={ 
                    content: post.content,
                    published:true,
                    ...(post.mediaUrl?{mediaItems:[{type:post.mediaType || "image",url:post.mediaUrl}]}:{}) as any,
                    platform : zernioPlatforms,
                }
                console.log(`publishing post ${post._id} to zernio with media: ${post.mediaUrl || "none "}`)
                const response = await zernio.posts.createPost({
                    body: payload
                })
                const publishedPost = (response.data as any)?.post || response.data;
                if(!publishedPost){
                    throw new Error("Failed to get post object from zernio response ")
                }
                console.log(`Zernio post created: ${publishedPost._id || publishedPost.id} `)
               
                post.status = "published"
                await post.save()

                await ActivityLog.create({
                    user:post.user,
                    activityType:"POST_PUBLISHED",
                    description:`Post published to ${post.platform.join(", ")}`,
                    relatedPost:post._id,
                    platform:post.platform.join(", ")
                })
            } catch (error) {
                console.error("Error publishing post",error)
                post.status = "failed"
                await post.save()
            }
        }
        if(postToPublish.length > 0){
            console.log(`Published ${postToPublish.length} posts at ${now.toISOString()}`)
        }
    } catch(error){
        console.error("Error in scheduler",error)
    }
    })
    console.log("Scheduler service inintalized.")
}