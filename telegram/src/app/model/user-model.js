"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
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
});
exports.User = mongoose_1.default.model('users', UserSchema);
