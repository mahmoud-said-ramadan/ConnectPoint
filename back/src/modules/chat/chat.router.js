import * as chatController from './controller/chat.js'
import { roles, auth } from '../../middleware/auth.js'
import { Router } from 'express';
const router = Router();


router.route('/')
    .post(
        auth(Object.values(roles)),
        chatController.sendMessage
    )
    .get(
        auth(Object.values(roles)),
        chatController.getChat
    );
