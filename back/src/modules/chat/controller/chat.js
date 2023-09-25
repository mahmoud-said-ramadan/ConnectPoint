import chatModel from "../../../../DB/model/Chat.model.js";
import userModel from "../../../../DB/model/User.model.js";
import { asyncHandler } from "../../../utilis/errorHandling.js";
import { getIo } from "../../../utilis/server.js";


export const sendMessage = asyncHandler(async (req, res, next) => {
    console.log('Send Message');
    const { message, to } = req.body;
    const isToExist = await userModel.findById(to)
    if (!isToExist) {
        return next(new Error('In-Valid User', { cause: 404 }));
    }
    const chatExist = await chatModel.findOne({
        $or: [
            { userOne: req.user._id, userTwo: to },
            { userOne: to, userTwo: req.user._id }
        ]
    }).populate([
        {
            path: 'messages.from'
        },
        {
            path: 'messages.to'
        }
    ]);
    if (!chatExist) {
        const newChat = await chatModel.create({
            userOne: req.user._id,
            userTwo: to,
            messages: [{
                from: req.user._id,
                to,
                message
            }]
        });
        getIo().to(isToExist.socketId).emit('recieveMessage', { chatId: newChat._id, message, sender: req.user });
        return res.status(201).json({ message: 'Done!' });
    }

    chatExist?.messages.push({
        from: req.user._id,
        to,
        message
    });
    await chatExist.save();
    getIo().to(isToExist.socketId).emit('recieveMessage', { chatId: chatExist._id, message, sender: req.user });
    return res.status(201).json({ message: 'Done!' });
})

export const getChat = asyncHandler(async (req, res, next) => {
    const { to } = req.params;
    const chat = await chatModel.findOne({
        $or: [
            { userOne: req.user._id, userTwo: to },
            { userOne: to, userTwo: req.user._id }
        ]
    }).populate([
        {
            path: 'messages.from'
        },
        {
            path: 'messages.to'
        }
    ]);
    return res.status(201).json({ message: 'Done!', chat });
})