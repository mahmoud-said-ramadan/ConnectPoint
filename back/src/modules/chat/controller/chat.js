import chatModel from "../../../../DB/model/Chat.model.js";
import userModel from "../../../../DB/model/User.model.js";
import cloudinary from "../../../utilis/cloudinary.js";
import { asyncHandler } from "../../../utilis/errorHandling.js";
import { getIo } from "../../../utilis/server.js";
import { nanoid } from "nanoid";
import fs from 'fs'

export const sendMessage = asyncHandler(async (req, res, next) => {
    console.log('Send Message');
    const { message, to } = req.body;
    const isToExist = await userModel.findById(to);
    let customId = '';
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

    chatExist ? customId = chatExist.customId : customId = nanoid();

    let messageType = 'text';

    try {
        // Handle file upload (if exists)
        if (req.file) {
            let file = null;
            let folderName = '';
            let uploadResult = '';

            console.log(req.file);
            if (req.file.mimetype.startsWith('video/')) {
                console.log('video---------------');
                // Handle video upload
                file = req.file;
                messageType = 'video';
                folderName = file.mimetype.split('/')[0];
                uploadResult = await cloudinary.uploader.upload(file.path, {
                    folder: `${process.env.APP_NAME}/${folderName}/${customId}`,
                    resource_type: 'video', // Set the resource type to 'video'
                    type: 'upload', // Set the type to 'upload'
                    resource_options: { // Set the content type to 'video/*'
                        resource_type: 'auto',
                        type: 'video/*'
                    }
                });
            } else if (req.file.mimetype.startsWith('application/')) {
                console.log('document---------------');
                // Handle document upload
                file = req.file;
                messageType = 'document';
                folderName = file.mimetype.split('/')[0];
                uploadResult = await cloudinary.uploader.upload(file.path, {
                    folder: `${process.env.APP_NAME}/${folderName}/${customId}`,
                    resource_type: 'raw', // Set the resource type to 'video'
                    type: 'upload', // Set the type to 'upload'
                    resource_options: { // Set the content type to 'video/*'
                        resource_type: 'audio',
                        type: 'application/*'
                    }
                });
            } else if (req.file.mimetype.startsWith('audio/')) {
                console.log('Audio---------------');
                // Handle document upload
                file = req.file;
                messageType = 'audio';
                folderName = file.mimetype.split('/')[0];
                uploadResult = await cloudinary.uploader.upload(file.path, {
                    folder: `${process.env.APP_NAME}/${folderName}/${customId}`,
                    resource_type: 'raw', // Set the resource type to 'video'
                    type: 'upload', // Set the type to 'upload'
                    resource_options: { // Set the content type to 'video/*'
                        resource_type: 'auto',
                        type: 'audio/*'
                    }
                });
            } else {
                console.log('Image---------------');
                // Handle image upload
                file = req.file;
                messageType = 'image';
                folderName = file.mimetype.split('/')[0];
                uploadResult = await cloudinary.uploader.upload(file.path, {
                    folder: `${process.env.APP_NAME}/${folderName}/${customId}`
                });
            }

            console.log({ uploadResult });
            req.body.file = {
                secure_url: uploadResult.secure_url,
                public_id: uploadResult.public_id,
                format: uploadResult.format,
                originalName: file.originalname,
                size: (uploadResult.bytes / 1000)
            };

            fs.unlinkSync(file.path);
        }

    } catch (error) {
        console.log('Cloudinary upload error:', error);
    }


    const newMessage = {
        from: req.user._id,
        to,
        content: message,
        messageType,
        file: req.body?.file
    };
    console.log(newMessage);


    if (!chatExist) {
        const newChat = await chatModel.create({
            userOne: req.user._id,
            userTwo: to,
            messages: newMessage,
            customId
        });
        getIo().to(isToExist.socketId).emit('recieveMessage', { chatId: newChat._id, message: newMessage, sender: req.user });
        return res.status(201).json({ chatId: newChat._id, message: newMessage });
    }

    chatExist?.messages.push(newMessage);
    await chatExist.save();
    console.log(newMessage);
    getIo().to(isToExist.socketId).emit('recieveMessage', { chatId: chatExist._id, message: newMessage, sender: req.user });
    return res.status(201).json({ chatId: chatExist._id, message: newMessage });
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



// import cloudinary from 'cloudinary';

// export const addMessage = asyncHandler(async (req, res, next) => {
//     console.log('Add Message');
//     const { chatId, message } = req.body;
//     const chat = await chatModel.findById(chatId);
//     if (!chat) {
//         return next(new Error('Chat not found', { cause: 404 }));
//     }


//     let messageType = 'text';
//     // Handle file upload (if exists)
//     if (req.file) {
//         const folderName = getFileFolderName(req.file.mimetype);
//         const uploadResult = await cloudinary.v2.uploader.upload(req.file.path, {
//             folder: `${process.env.APP_NAME}/${folderName}/${chat.customId}`
//         });
//         req.body.file = {
//             secure_url: uploadResult.secure_url,
//             public_id: uploadResult.public_id,
//             format: uploadResult.format
//         };
//         messageType = uploadResult.format;
//         fs.unlinkSync(req.file.path);
//     }
//     const newMessage = {
//         from: req.user._id,
//         to: chat.userOne.toString() === req.user._id.toString() ? chat.userTwo : chat.userOne,
//         content: message,
//         messageType,
//         file: req.body.file
//     };

//     chat.messages.push(newMessage);
//     await chat.save();

//     // Emitting the message event
//     getIo().to(chatId).emit('receiveMessage', {
//         chatId,
//         message: newMessage
//     });
//     return res.status(201).json({ message: 'Done!' });
// });