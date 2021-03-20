"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var Schema = mongoose_1.default.Schema;
var UserSchema = new Schema({
    chatId: {
        type: String,
    },
    role: {
        type: String,
        default: 'user'
    },
    name: String,
    token: String
});
exports.User = mongoose_1.default.model('users', UserSchema);
