import chatModel from "../../../../DB/model/Chat.model.js";
import userModel from "../../../../DB/model/User.model.js";
import { asyncHandler } from "../../../utilis/errorHandling.js";


export const sendMessage = asyncHandler(async (req, res, next) => {
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
            path: 'userOne'
        },
        {
            path: 'userTwo'
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
        // get.io.to()
        return res.status(201).json({ message: 'Done!', newChat });
    }

    chatExist.messages.push({
        from: req.user._id,
        to,
        message
    });
    await chatExist.save();
    // get.io.to()
    return res.status(201).json({ message: 'Done!', chatExist });
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
            path: 'userOne'
        },
        {
            path: 'userTwo'
        }
    ]);
    return res.status(201).json({ message: 'Done!', chat });
})