import mongoose from "mongoose";
const Schema = mongoose.Schema

const UserSchema = new Schema({
    chatId: {
        type: String,
    },
    role: {
        type: String,
        default: 'user'
    },
    name: String,
    token: String
})

export const User = mongoose.model('users', UserSchema)
