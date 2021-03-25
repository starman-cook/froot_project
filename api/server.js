const express = require('express');
const mongoose = require('mongoose');
const users = require('./app/users');
const payments = require('./app/payments');
const cors = require('cors');
const config = require('./app/config');
const User=require('./app/models/User');
const {nanoid}=require('nanoid');

const app = express();
const port = 8000;

// const corsOptions = {
//     origin: 'http://104.248.198.29:3000',
//     optionsSuccessStatus: 200
// }

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const run = async () => {
    
    await mongoose.connect(config.db.url+'/'+config.db.name, {
        useNewUrlParser:true, 
        useUnifiedTopology: true
    })

    app.use('/payments', payments());
    app.use('/users', users());


    app.listen(port, () => {
        console.log(`Server started on port ${port}!`)
    })
    console.log('Mongoose connected!');
    const admin = await User.findOne({role: "admin"})

    if (!admin) {
        console.log("Admin created")
        await User.create({
            workEmail: "admin@admin.com",
            surname: "Admin",
            name: "Admin",
            patronymic: "Admin",
            position: "admin",
            telegramName: "@admin",
            phone: "+7 555 555 55 55",
            password: "12345a",
            role: "admin",
            token: nanoid()
        });
    }
   
    console.log('fixtures connected');
};
run().catch(console.log);