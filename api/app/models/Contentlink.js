const { stream } = require('exceljs');
const mongoose = require('mongoose');
const idvalidator = require('mongoose-id-validator');

const Schema = mongoose.Schema;

const ContentlinkSchema = new Schema({
    url: {
        type: String,
        required: true
    },
    startdate: {
        type: String,
    },
    stopdate: {
        type: String,
    },
    startscreen: String,
    stopscreen: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    repeats: {
        type: Array,
        default: []
    }
});
ContentlinkSchema.plugin(idvalidator);
const Contentlink = mongoose.model('Contentlink', ContentlinkSchema);
module.exports = Contentlink;
