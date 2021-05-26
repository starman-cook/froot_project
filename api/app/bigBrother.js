const express = require('express');
const router = express.Router();
const moment = require('moment')
const BigBrother = require('./models/BigBrother');
const multer = require('multer');
multer({
    limits: { fieldSize: 2 * 1024 * 1024 }
})
const upload = multer();

router.get('/', async(req, res) => {
    try {
        const jobs = await BigBrother.find()
        res.send(jobs)
    } catch (err) {
        res.status(400).send({ message: err });
    }
})

router.get('/:userId', async(req, res) => {
    try {
        console.log(req.params.userId)
        const jobs = await BigBrother.find({user: req.params.userId}).populate("User")
        res.send(jobs)
    } catch (err) {
        res.status(400).send({ message: err });
    }
})

router.get('/:userId/lastJob', async(req, res) => {
    console.log("LAST DAMNED *********** ",req.body)
    try {
        const lastJob = await BigBrother.findOne({user: req.params.userId, stopScreen: null})
        if (lastJob) {
            res.send(lastJob)
        } else {
            res.send({message: "ok"})
        }
    } catch (err) {
        res.status(400).send({ message: err });
    }
})

router.delete("/:id", async (req, res) => {
    try {
        await BigBrother.findByIdAndRemove(req.param.id)
        res.send({message: "ok"})
    } catch(err) {
        res.status(400).send({ message: err });
    }
})

router.post('/', upload.none(), async (req, res) => {
    console.log("BODY BITCH ********* ", req.body)
    try {

        const lastJob = await BigBrother.findOne({user: req.body.user, stopScreen: null})
        if (lastJob) {

            lastJob.stopScreen = req.body.image
            const duration = moment.duration(moment().valueOf() - lastJob.startTime)
            lastJob.totalTime = `${duration.hours()}:${duration.minutes()}:${duration.seconds()}`
            lastJob.startTime = moment(lastJob.startTime, "x").format("DD-MM-YYYY_HH:mm:ss")
            lastJob.stopTime = moment().format("DD-MM-YYYY_HH:mm:ss")

            lastJob.save({ validateBeforeSave: false });
        }
        else {
            const bBrother = await new BigBrother()
            bBrother.startScreen = req.body.image
            bBrother.startTime = moment().valueOf()
            bBrother.merchant = req.body.merchant
            bBrother.user = req.body.user
            bBrother.save({ validateBeforeSave: false });
        }
        res.send({message: "success"});
    } catch (err) {
        res.status(400).send({ message: "err" });
    }
});

module.exports = router;
