const mongoose = require('mongoose')

const Schema = mongoose.Schema
const CalendarEventSchema = new Schema ({
    monthYear: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    scale: [{
        type: String
    }],
    color: String,
    title: String,
    description: String,
    participants: [],
    room: String,
    file: String,
    date: String,
    from: String,
    to: String
})

const CalendarEvent = mongoose.model('CalendarEvent', CalendarEventSchema)
module.exports = CalendarEvent