import "dotenv/config"
import express , {NextFunction, Request,Response} from "express"
import { request } from "node:http";
import cors from "cors";
import connectDB from "./config/db.js";
const app = express();

//db conneciton
connectDB();

//middleware 
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

app.get('/',(_req:Request,_res:Response)=>{
    _res.send('Server is Live')
})

//golbal error handler
//we used '_" beacuase they are unused
app.use((err:Error,_req:Request,res:Response,_next:NextFunction)=>{
    console.error(err)
    res.status(500).json({message:"Internal Server Error",success:false })
})
app.listen(port,()=>{
    console.log(`Server is running at http://localhost:${port}`)
})
