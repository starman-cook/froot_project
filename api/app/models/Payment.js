const mongoose = require('mongoose');
const idvalidator = require('mongoose-id-validator');

const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    purpose: {
        type: String,
        required: true,
    },
    payer: {
        type: String,
        required: true
    },
    costCenter: {
        type: String,
        // required:true
    },
    invoice: {
        type: String,
        required: true
    },
    sum: {
        type: String,
        required: true
    },
    dateOfPayment: {
        type: String,
        required: true
    },
    contractor: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    comment: {
        type: String,
    },
    approved: {
        type: Boolean,
        required: true,
        default: false
    },
    paided: {
        type: Boolean,
        required: true,
        default: false
    },
    repeatability: {
        type: Boolean,
        required: true,
        default: false
    },
    noticePeriod: {
        type: String,
    },
    periodicity: {
        type: String,
        enum: ['monthly', 'weekly', '']
    },
    repeatabilityId: {
        type: String,
    },
    repeatabilityClosed: {
        type: Boolean,
        default: false
    },
    repeatabilityApplied: {
        type: Boolean,
        default: false
    }
});
PaymentSchema.plugin(idvalidator);
const Payment = mongoose.model('Payment', PaymentSchema);
module.exports = Payment;
