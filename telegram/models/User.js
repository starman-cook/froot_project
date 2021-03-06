const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema=new Schema({
    chatId:{
        type:String
    },
    workEmail:{
        type:String,
        unique:true
    },
    name:{
        type:String
    },
    role:{
        type:String
    }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;