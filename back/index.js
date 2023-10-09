import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import express from 'express'
import initApp from './src/index.router.js'
import './src/utilis/cloudinary.js';
// import './src/utils/scheduler.js'
//set directory dirname 
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, './config/.env') })


const app = express()

import { createHandler } from 'graphql-http/lib/use/express';
import { schema } from './graphQL/schema.js'
import userModel from './DB/model/User.model.js'
import { initIo } from './src/utilis/server.js'
import { getAllUsers, getFriends } from './src/modules/user/controller/user.js'


app.all('/graphql', createHandler({ schema }));
// setup port and the baseUrl
const port = process.env.PORT || 5000
initApp(app, express)
const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`))

const io = initIo(server);

io.on('connection', socket => {
    console.log({ socket: socket.id });
    socket.on('updateSocketId', async (data) => {
        console.log({ userId: data });
        // const { id } = data
        await userModel.updateOne({ _id: data }, { socketId: socket.id });
        socket.emit('updateSocketId', "Done!")
    });
})


// Keep track of connected users and their respective friends
const connectedUsers = new Map();

// Store the socket ID and user ID in connectedUsers map
export const loginUser = (userId, socketId) => {
    console.log('loginUser---------------', userId);
    connectedUsers.set(userId.toString(), socketId);
}

// Remove the user from the connectedUsers map and inform friends about the offline status
export const logoutUser = async (socketId) => {
    console.log('logoutUser---------------', socketId);

    const disconnectedUserId = [...connectedUsers.entries()].find(([, id]) => id === socketId)?.[0];
    console.log(disconnectedUserId);

    if (disconnectedUserId) {
        const user = await userModel.findOne({ socketId: disconnectedUserId }).select('friends');
        const friends = user.friends.map(friend => friend.user.toString());
        console.log(friends);

        friends.forEach((friendId) => {
            const friendSocketId = connectedUsers.get(friendId);
            if (friendSocketId) {
                io.to(friendSocketId).emit('friendOffline', disconnectedUserId);
            }
        });

        connectedUsers.delete(disconnectedUserId);
    }
}