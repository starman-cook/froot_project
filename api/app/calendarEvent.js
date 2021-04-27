const express = require('express')
const router = express.Router()
const CalendarEvent = require('./models/CalendarEvent')
const User = require('./models/User')
const multer = require('multer')
const { nanoid } = require('nanoid');
const path = require('path')
const config = require('./config')
const auth = require('./middleware/auth.js');
const axios = require('axios')


const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, config.uploadPath);
    },
    filename:(req, file, cb) => {
        cb(null, nanoid() + path.extname(file.originalname));
    }
});
const upload = multer({storage});


router.post('/', upload.single('file'), async (req, res) => {
    console.log(req.body)
    try {

        // if (req.body.participants) {
        //     req.body.participants = JSON.parse(req.body.participants)
        // }
        // console.log(req.body)
        // req.body.user = req.body.user
        // console.log(req.body.user)
        // req.body.participants = JSON.parse(req.body.participants)
        const event = await new CalendarEvent(req.body)
        event.participants = JSON.parse(req.body.participants)

        if (req.file) {
            event.file = req.file.filename;
        };

        // const arrDate = req.body.date.split("-")
        // const monthDate = `${arrDate[1]}-${arrDate[2]}`
        // const month = await Month.findOne({date: monthDate})
        // if (!month) {
        //     month = await new Month({date: monthDate, busy: req.body.scale.length})
        // } else {
        //     month.busy += 1
        //
        // }
        // month.save()
        await event.save()
        const user = await User.findById(req.body.user)
        try{
            event.user = user
            axios.post(config.baseUrlForTelegram + ':8001/telegram/calendarEvents', event);

        } catch (err) {
            console.log(err)
        }
        console.log(event)

        res.send(event)
    } catch (err) {
        res.status(500).send({error: err})
    }

})

router.get('/:room/:date/monthly', async (req, res) => {
    try {
        // create obj with all data
        // then find month and update
        // if no month, then create with this object
        // Great))
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
        res.status(500).send({error: err})
    }
})

router.get('/:room/:date/daily', async (req, res) => {
    try {
        const filter = {
            room: req.params.room,
            date: req.params.date
        }
        const events = await CalendarEvent.find(filter).populate('user')
        // for (let i = 0; i < events.length; i++) {
        //     const creator = await User.findById(events[i].user)
        //     events[i].user = creator
        //     let allParticipants = []
        //     for (let j = 0; j < events[i].participants.length; j++) {
        //         const participant = await User.findOne({_id: events[i].participants[j].userId})
        //         participant.accepted = events[i].participants[j].accepted
        //         allParticipants.push(participant)
        //     }
        //     events[i].participants = allParticipants
        // }
        res.send(events)
    } catch (err) {
        res.status(500).send({error: err})
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const event = await CalendarEvent.findById(req.params.id)
        try{
            axios.post(config.baseUrlForTelegram + ':8001/telegram/delete/calendarEvents', event);
        } catch (err) {
            console.log(err)
        }
        await CalendarEvent.findByIdAndRemove(req.params.id)
        res.send({message: "Success"})
    } catch (err) {
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

        console.log("*************************************************** ",meeting);
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
        await meeting.save();
        console.log(meeting);
        res.send(meeting);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router