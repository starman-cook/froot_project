const express = require('express')
const router = express.Router()
const CalendarEvent = require('./models/CalendarEvent')
const User = require('./models/User')
const multer = require('multer')
const { nanoid } = require('nanoid');
const path = require('path')
const config = require('./config')


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
    try {
        req.body.user = await User.findById(req.body.user)
        const event = await new CalendarEvent(req.body);
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
        const events = await CalendarEvent.find(filter)
        for (let i = 0; i < events.length; i++) {
            const creator = await User.findById(events[i].user)
            events[i].user = creator
            for (let j = 0; j < events[i].participants.length; j++) {
                const participant = await User.findById(events[i].participants[j])
                events[i].participants[j] = participant
            }
        }
        res.send(events)
    } catch (err) {
        res.status(500).send({error: err})
    }
})

router.delete('/:id', async (req, res) => {
    try {
        await CalendarEvent.findByIdAndRemove(req.params.id)
        res.send({message: "Success"})
    } catch (err) {
        res.status(500).send({error: err})
    }
})


module.exports = router