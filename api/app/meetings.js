const express = require('express');
const auth = require('./middleware/auth.js');
const router = express.Router();
const upload = require('./middleware/upload.js');
const permit = require('./middleware/permit.js');
const axios = require('axios');
const config = require('./config');

const moment = require('moment');
const Meeting = require('./models/Meeting');

const createRouter = () => {
    router.post('/', auth, async (req, res) => {
        try {
            const meeting = new Meeting({ ...req.body, ...{ user: req.user._id } });
            meeting.save({ validateBeforeSave: false });
            let telegram_res;
            try {
                telegram_res = await axios.post(config.baseUrlForTelegram + ':8001/telegram/meetings', meeting);
            } catch (error) {
                return res.status(500).send(error)
            }
            res.send(meeting);
        } catch (e) {
            res.status(500).send({ error: 'Error' });
        }

    });
    router.get('/:id/accept', auth, async (req, res) => {
        try {
            const meeting = await Meeting.findById(req.params.id);
            for (let i = 0; i < meeting.participants.length; i++) {
                if (req.user._id.toString() === meeting.participants[i].userId) {
                    meeting.participants[i].accepted = true;
                };
            };
            await meeting.save();
            console.log(meeting);
            res.send(meeting);
        } catch (error) {
            res.status(500).send(error);
        }
    });

    router.get('/:id/reject', auth, async (req, res) => {
        try {
            const meeting = await Meeting.findById(req.params.id);
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

    router.get('/', auth, async (req, res) => {
        try {
            const meetings = await Meeting.find().populate("user");
            res.send(meetings);
        } catch (e) {
            res.status(500).send(e);
        }
    })
    router.put('/:id', auth, async (req, res) => {
        try {
            const meeting = await Meeting.findByIdAndUpdate(req.params.id, req.body);
            meeting.save({ validateBeforeSave: false });
            res.send(meeting);
        }
        catch (e) {
            res.status(500).send({ error: 'Error' });
        }
    });
    router.delete('/:id', auth, async (req, res) => {
        try {
            await Meeting.findByIdAndRemove(req.params.id);
            res.send({ message: 'success' });
        }
        catch (e) {
            res.status(500).send({ error: 'Error' });
        }
    })
    return router;
}

module.exports = createRouter;