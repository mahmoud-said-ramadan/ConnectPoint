import mongoose, { Schema, Types, model } from "mongoose";


const chatSchema = new Schema(
    {
        userOne: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        userTwo: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        messages: [
            {
                from: { type: Schema.Types.ObjectId, ref: 'User', required: true },
                to: { type: Schema.Types.ObjectId, ref: 'User', required: true },
                messageType: { type: String, default: 'text', enum: ['text', 'audio', 'video', 'image', 'document'], required: true },
                content: { type: String },
                file: {
                    secure_url: { type: String },
                    public_id: { type: String },
                    format: { type: String },
                    size: { type: String },
                    originalName: { type: String }
                }
            }
        ],
        customId: { type: String }
    },
    {
        timestamps: true
    }
);


const chatModel = mongoose.model.Chat || model('Chat', chatSchema)
export default chatModel