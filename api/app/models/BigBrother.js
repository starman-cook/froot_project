const mongoose = require('mongoose');
const idvalidator = require('mongoose-id-validator');

const Schema = mongoose.Schema;

const BigBrotherSchema = new Schema({
   user: {
       type: Schema.Types.ObjectId,
   },
    startTime: String,
    stopTime: String,
    totalTime: String,
    startScreen: String,
    stopScreen: String,
    merchant: String,
    userName: String,
}, {
    timestamps: true
});
BigBrotherSchema.plugin(idvalidator);
const BigBrother = mongoose.model('BigBrother', BigBrotherSchema);
module.exports = BigBrother;
