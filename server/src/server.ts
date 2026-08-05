import "dotenv/config"
import express , {NextFunction, Request,Response} from "express"
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.route.js";
import socialAuthRouter from "./routes/socialAuth.routes.js";
import accountRouter from "./routes/account.routes.js";
import postRouter from "./routes/post.route.js";
import activityRouter from "./routes/activity.routes.js";
import agenda from "./config/agenda.js"
import "./jobs/publishPost.js";

const app = express();

//db conneciton
await connectDB();
await agenda.start();

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) {
            callback(null, true);
            return;
        }
        const cleanOrigin = origin.replace(/\/$/, "");
        const cleanFrontend = (process.env.FRONTEND_URL || "").replace(/\/$/, "");
        
        if (
            cleanOrigin === cleanFrontend ||
            origin.endsWith(".vercel.app") ||
            origin.startsWith("http://localhost:")
        ) {
            callback(null, true);
        } else {
            callback(null, false);
        }
    },
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json());

const port = process.env.PORT || 3000;

app.get('/',(_req:Request,_res:Response)=>{
    _res.send('Server is Live')
})

app.use("/api/auth",authRoutes)
app.use("/api/oauth",socialAuthRouter)
app.use("/api/accounts",accountRouter)
app.use("/api/posts",postRouter)
app.use("/api/activity",activityRouter)

//initialize scheduler
// initScheduler();

//golbal error handler
//we used '_" beacuase they are unused
app.use((err:Error,_req:Request,res:Response,_next:NextFunction)=>{
    console.error(err)
    res.status(500).json({message:"Internal Server Error",success:false })
})
app.listen(port,()=>{
    console.log(`Server is running at http://localhost:${port}`)
})
