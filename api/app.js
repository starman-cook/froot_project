const express = require('express');
const users = require('./app/users');
const payments = require('./app/payments');
const meetings = require('./app/meetings');
const news = require('./app/news');
const calendarEvents = require('./app/calendarEvent');
const contentlinks = require('./app/contentlinks');
const cors = require('cors');
const rooms = require('./app/room')

const app = express();
const port = process.env.NODE_ENV !== 'test' ? 8000 : 8010;

const corsOptions = {
    origin: 'http://104.248.198.29:3000',
    optionsSuccessStatus: 200
}

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/meetings', meetings());
app.use('/payments', payments());
app.use('/users', users());
app.use('/calendarEvents', calendarEvents)
app.use('/rooms', rooms)
app.use('/contentlinks', contentlinks());
app.use('/news', news());

module.exports = { app, port };