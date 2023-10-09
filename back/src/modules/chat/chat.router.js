import * as chatController from './controller/chat.js'
import { roles, auth } from '../../middleware/auth.js'
import { Router } from 'express';
import { fileUpload, fileValidation } from '../../utilis/multer.js';
const router = Router();


router.route('/')
    .post(
        auth(Object.values(roles)),
        // fileUpload([...fileValidation.image, ...fileValidation.video, ...fileValidation.voice]).single('file'),
        fileUpload([...fileValidation.image, ...fileValidation.video, ...fileValidation.file, ...fileValidation.voice]).single('file'),
        chatController.sendMessage
    );

router.route('/:to')
    .get(
        auth(Object.values(roles)),
        chatController.getChat
    );


export default router;

