const mongoose = require('mongoose');
const idvalidator = require('mongoose-id-validator');

const Schema = mongoose.Schema;

const MeetingSchema = new Schema({
    // id: {
    //     type:Number,
    //     required:true,
    //     unique:true
    // },
    title: String,
    // startDate: {
    //     type: String,
    //     required: true
    // },
    // endDate: {
    //     type: String,
    //     required: true,
    // },
    description: String,
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true
    },
    room: String,
    file: String,
    participants: [
        {
            userId: {
                type: String
            },
            accepted: {
                type: Boolean,
                default: false
            },
        }
    ],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        // default: 0
    },
    // location: String,
    // allday: Boolean,
    // rRule: String,
    // notes: String,
    // participants: String,
    // docs: String,
});
MeetingSchema.plugin(idvalidator);
// MeetingSchema.pre("save", async function (next) {
//     const meeting = await Meeting.find()
//     if (meeting.length > 0) this.id = meeting[meeting.length - 1].id + 1
//     else this.id = 0
//     next();
// })
const Meeting = mongoose.model('Meeting', MeetingSchema);
module.exports = Meeting;
