import {Router} from 'express';
import {protect} from "../middleware/authMiddleware.js"
import {getAccount, disconnectAccount, addAccount} from "../controllers/accountController.js"


const accountRouter = Router();

accountRouter.get('/',protect,getAccount);
accountRouter.post('/',protect,addAccount)
accountRouter.delete('/:id',protect,disconnectAccount);

export default accountRouter