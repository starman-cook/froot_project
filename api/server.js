const express = require('express');
const mongoose = require('mongoose');
const users = require('./app/users');
const payments = require('./app/payments');
const meetings = require('./app/meetings');
const news = require('./app/news');
const calendarEvents = require('./app/calendarEvent');
// const contentlinks = require('./app/contentlinks');
const cors = require('cors');
const config = require('./app/config');
const User = require('./app/models/User');
// const mongo = require('./app/db');
const rooms = require('./app/room')
const bigBrother = require('./app/bigBrother')

const app = express();
const port = process.env.PORT || 8000;


app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const run = async () => {

    await mongoose.connect(config.db.url + '/' + config.db.name, { useNewUrlParser: true, useUnifiedTopology: true }) //добавлено для демо
    // mongo.mongoConnect();

    app.use('/meetings', meetings());
    app.use('/payments', payments());
    app.use('/users', users());
    app.use('/bigBrother', bigBrother);
    app.use('/calendarEvents', calendarEvents)
    app.use('/rooms', rooms)
    // app.use('/contentlinks', contentlinks());
    app.use('/news', news());

    app.listen(port, () => {
        console.log(`Server started on port ${port}!`)
    })
    console.log('Mongoose connected!'); //добавлено для демо

    const admin=await User.findOne({workEmail: "admin@admin.com"});
    if(!admin){
        await User.create({
            workEmail: "admin@admin.com",
            surname: "Admin",
            name: "Admin",
            patronymic: "Admin",
            position: "admin",
            telegramName: "@admin",
            phone: "+7 555 555 55 55",
            password: "12345a",
            role: ['deleteMeetingRoom', 'addNewMeetingRoom','viewAllPayments', 'stopRepeatabilityPayment', 'addPayment', 'editPayment', 'approvePayment', 'postponePayment', 'viewToBePaid', 'viewTodayPayments', 'cancelApprovedPayment', 'deletePayment', 'authorizeUser', 'editUser', 'deleteUser', 'viewUsers', 'bookMeetingRoom', 'editBookedMeetingRoom', 'deleteBookedMeetingRoom', 'viewBookingsMeetingRoom', 'addContentlink', 'viewOwnContentlinks', 'viewAllContentlinks'],
            token: ['adminToken','adminToken']
        });
        console.log('fixtures connected');    
    }


};
run().catch(console.log);