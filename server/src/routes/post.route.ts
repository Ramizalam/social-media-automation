import {Router} from 'express';
import { generatePost, schedulePost } from '../controllers/postController.js';
import { upload } from '../config/multer.js';
import { protect } from '../middleware/authMiddleware.js';
import { getPost,getGenrations, } from '../controllers/postController.js';

const postRouter = Router();

postRouter.get('/',protect,getPost);
postRouter.get('/generations',protect,getGenrations);
postRouter.post('/',protect,upload.single('media'),schedulePost);
postRouter.post('/generate',protect,generatePost)


export default postRouter;