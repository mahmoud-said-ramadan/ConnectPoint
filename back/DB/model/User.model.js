import mongoose, { Schema, Types, model } from "mongoose";


const userSchema = new Schema({
    userName: {
        type: String,
        required: [true, 'userName is required'],
        min: [3, 'minimum length 3 chars'],
        max: [25, 'max length 25 chars']
    },
    email: {
        type: String,
        unique: [true, 'email must be unique value'],
        required: [true, 'userName is required'],
        lowercase: true,
    },
    tempEmail: {
        type: String,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'password is required'],
    },
    phone: {
        type: String,
        required: [true, 'phone is required'],
    },
    gender: {
        type: String,
        default: 'male',
        enum: ['male', 'female'],
        lowercase: true
    },
    role: {
        type: String,
        default: 'User',
        enum: ['User', 'Super']
    },
    status: {
        type: String,
        default: 'offline',
        enum: ['offline', 'online', 'blocked'],
    },
    confirmEmail: {
        type: Boolean,
        default: false,
    },
    friends: [
        {
            _id: false, // Exclude the _id field from the array objects
            user: { type: Types.ObjectId, ref: 'User', required: true },
            place: { type: String, default: 'main', enum: ['main', 'archive'] }
        }
    ],
    image: Object,
    DOB: String,
    customId: String,
    socketId: String,
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true
})


const userModel = mongoose.model.User || model('User', userSchema)
export default userModel