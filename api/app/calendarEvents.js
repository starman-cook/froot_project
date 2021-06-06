const express = require('express')
const router = express.Router()
const CalendarEvent = require('./models/CalendarEvent')
const User = require('./models/User')
const multer = require('multer')
const { nanoid } = require('nanoid');
const path = require('path')
const config = require('./config')
const auth = require('./middleware/auth.js');
const axios = require('axios');
const logger=config.log4jsApi.getLogger("api");
const moment = require('moment')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.uploadPath);
    },
    filename:(req, file, cb) => {
        cb(null, nanoid() + path.extname(file.originalname));
    }
});
const upload = multer({storage});


router.post('/', auth, upload.single('file'), async (req, res) => {
    try {
        const event = await new CalendarEvent(req.body)
        event.participants = JSON.parse(req.body.participants)

        if (req.file) {
            event.file = req.file.filename;
        };

        event.user = req.user._id
        await event.save()
        if (process.env.NODE_ENV !== 'test') {
        try {

                await axios.post(config.baseUrlForTelegram + ':8001/telegram/calendarEvents', {event: event, creator: req.user});

        } catch (err) {
            console.log(err)
        }
    }
        res.send(event)
    } catch (err) {
        logger.error('POST /calendarEvents '+err);
        res.status(500).send({error: err})
    }
})

router.get('/:room/:date/monthly', auth, async (req, res) => {
    try {
        const business = []
        const filter = {
            room: req.params.room,
            monthYear: req.params.date
        }
        const datesArray = await CalendarEvent.find(filter)
        datesArray.map((el) => {
            const indexExist = business.findIndex(a => a.date === el.date)
            if (indexExist >= 0) {
                const busy = business[indexExist].busy + el.scale.length
                business[indexExist] = {date: el.date, busy: busy}
            } else {
                business.push({date: el.date, busy: el.scale.length})
            }
        })
        const monthBusy = {
            room: req.params.room,
            date: req.params.date,
            busy: business
        }
        res.send(monthBusy)
    } catch (err) {
        logger.error('GET /calendarEvents/:room/:date/monthly '+err);
        res.status(500).send({error: err})
    }
})

router.get('/:room/:date/daily', auth, async (req, res) => {
    try {
        const filter = {
            room: req.params.room,
            date: req.params.date
        }
        const events = await CalendarEvent.find(filter).populate('user')
        res.send(events)
    } catch (err) {
        logger.error('GET /calendarEvents/:room/:date/daily '+err);
        res.status(500).send({error: err})
    }
})

router.delete('/:id', auth, async (req, res) => {
    try {
        const event = await CalendarEvent.findById(req.params.id)
        if (process.env.NODE_ENV !== 'test') {
            try{

                await axios.post(config.baseUrlForTelegram + ':8001/telegram/delete/calendarEvents', event);

        } catch (err) {
            console.log(err)
        }
        }
        await CalendarEvent.findByIdAndRemove(req.params.id)
        res.send({message: "Success"})
    } catch (err) {
        logger.error('DELETE /calendarEvents/:id '+err);
        res.status(500).send({error: err})
    }
})


router.get('/:id/accept', auth, async (req, res) => {
    try {
        const meeting = await CalendarEvent.findById(req.params.id);
        for (let i = 0; i < meeting.participants.length; i++) {
            if (req.user._id.toString() === meeting.participants[i].userId) {
                meeting.participants[i].accepted = true;
            };
        };
        await meeting.markModified('participants');
        await meeting.save();
        res.send(meeting);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/:id/reject', auth, async (req, res) => {
    try {
        const meeting = await CalendarEvent.findById(req.params.id);
        for (let i = 0; i < meeting.participants.length; i++) {
            if (req.user._id.toString() === meeting.participants[i].userId) {
                meeting.participants[i].accepted = false;
            };
        };
        await meeting.markModified('participants');
        await meeting.save();
        res.send(meeting);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get("/:userId/myEvents", auth, async(req, res) => {
    try {
        await CalendarEvent.find({"participants.userId": req.params.userId}, async(err, data) => {
            const arr = []
            for (let i = 0; i < data.length; i++) {
                if (moment(data[i].date, "DDMMYYYY").valueOf() < (moment().valueOf()) - 1000 * 60 * 60 * 24)  {
                    continue
                }
                 data[i].user = await User.findById(data[i].user)
                 arr.push(data[i])
            }
            res.send(arr);
        })
    } catch(error) {
        res.status(500).send(error);
    }
})

module.exports = router