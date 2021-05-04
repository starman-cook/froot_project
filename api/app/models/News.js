const mongoose = require('mongoose');
const idvalidator = require('mongoose-id-validator');

const Schema = mongoose.Schema;

const NewsSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    file: {
        type: String,
        required: true,
    },
    createDate: {
        type: String 
    },
    contentManager: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    status: {
        type: String,
        required: true,
        default: 'Не сделано'
    }
});
NewsSchema.plugin(idvalidator);
const News = mongoose.model('News', NewsSchema);
module.exports = News;
