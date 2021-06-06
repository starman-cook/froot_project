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
    dateOfNotification: {
        type: String
    },
    noticePeriod: {
        type: Number,
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
