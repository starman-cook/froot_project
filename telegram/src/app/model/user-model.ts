import mongoose from "mongoose";
const Schema = mongoose.Schema

const UserSchema = new Schema({
    chatId: {
        type: String,
    },
    role: {
        type: [String],
        default: ['viewAllPayments']
    },
    name: String,
    token: String,
    apiUserId: String
})

export const User = mongoose.model('users', UserSchema)
