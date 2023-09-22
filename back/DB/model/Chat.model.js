import mongoose, { Schema, Types, model } from "mongoose";


const chatSchema = new Schema({
    userOne: { type: Types.ObjectId, ref: 'User', required: true },
    userTwo: { type: Types.ObjectId, ref: 'User', required: true },
    messages: [{
        from: { type: Types.ObjectId, ref: 'User', required: true },
        to: { type: Types.ObjectId, ref: 'User', required: true },
        message: { type: String, required:true }
    }]
}, {
    timestamps: true
})


const chatModel = mongoose.model.Chat || model('Chat', chatSchema)
export default chatModel