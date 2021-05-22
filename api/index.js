const mongoose = require('mongoose');
const config = require('./app/config');
const User = require('./app/models/User');

const { app, port } = require('./app');

const run = async () => {
    if (process.env.NODE_ENV !== 'test') { ///// !!!чтобы отрабатывала тестовая среда - перенес сюда коннект к монго и слежение порта
        await mongoose.connect(config.db.url + '/' + config.db.name, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Mongoose connected!');
        app.listen(port, () => {
            console.log(`Server started on port ${port}!`);
        });
    }

    const admin = await User.findOne({ workEmail: "admin@admin.com" });
    if (!admin) {
        await User.create({
            workEmail: "admin@admin.com",
            surname: "Admin",
            name: "Admin",
            patronymic: "Admin",
            position: "admin",
            telegramName: "@admin",
            phone: "+7 555 555 55 55",
            password: "12345a",
            role: ['deleteMeetingRoom', 'addNewMeetingRoom', 'viewAllPayments', 'stopRepeatabilityPayment', 'addPayment', 'editPayment', 'approvePayment', 'postponePayment', 'viewToBePaid', 'viewTodayPayments', 'cancelApprovedPayment', 'deletePayment', 'authorizeUser', 'editUser', 'deleteUser', 'viewUsers', 'bookMeetingRoom', 'editBookedMeetingRoom', 'deleteBookedMeetingRoom', 'viewBookingsMeetingRoom', 'addContentlink', 'viewOwnContentlinks', 'viewAllContentlinks'],
            token: ['adminToken', 'adminToken']
        });
        console.log('fixtures connected');
    }
};
run().catch(console.log);