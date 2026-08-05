import agenda from "../config/agenda.js";
import zernio from "../config/zernio.js";
import { Account } from "../models/Account.js";
import ActivityLog from "../models/ActivityLog.js";
import { Post } from "../models/Post.js";

agenda.define("publish_post", async (job:any) => {
  

    const { postId } = job.attrs.data as {
        postId: string;
    };

    // Find post
    const post = await Post.findById(postId).populate("user");

    if (!post) {
        console.error(`Post ${postId} not found`);
        return;
    }

    try {
        const userId = post.user?._id || post.user;
        if (!userId) {
            console.error(`Post ${post._id} has no valid user assigned.`);
            return;
        }

        const accounts = await Account.find({ user: userId, platform: { $in: post.platforms }, status: "connected", zernioAccountId: { $exists: true } });
        if (!accounts || accounts.length === 0) {
            post.status ="failed"
            await post.save();
            console.log(`No connected Zernio account found for post ${post._id}`);
            return;
        }
        const zernioPlatforms = accounts.map((acc) => ({
            platform: acc.platform as any,
            accountId: acc.zernioAccountId!
        }))

        const payload = {
            content: post.content,
            publishNow: true,
            ...(post.mediaUrl ? { mediaItems: [{ type: post.mediaType || "image", url: post.mediaUrl }] } : {}) as any,
            platforms: zernioPlatforms,
        }
        console.log(`publishing post ${post._id} to zernio with media: ${post.mediaUrl || "none "}`)
         // Publish to Zernio
        const response = await zernio.posts.createPost({
            body: payload
        })
        const publishedPost = (response.data as any)?.post || response.data;
        if (!publishedPost) {
            throw new Error("Failed to get post object from zernio response ")
        }
        console.log(`Zernio post created: ${publishedPost._id || publishedPost.id} `)

           // Update status
        post.status = "published"
        await post.save()

    // Create activity log
        await ActivityLog.create({
            user: userId,
            activityType: "POST_PUBLISHED",
            description: `Post published to ${post.platforms.join(", ")}`,
            relatedPost: post._id,
            platform: post.platforms.join(", ")
        })
    } catch (error) {
        console.error("Error publishing post", error)
        post.status = "failed"
        await post.save()
    }
});