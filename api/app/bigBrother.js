const express = require('express');
const router = express.Router();
const moment = require('moment')
const BigBrother = require('./models/BigBrother');
const config = require('./config');
const multer = require('multer')
const {nanoid} = require('nanoid')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {

        // try {
        //     fs.opendir("./" + moment().format("DD_MM_YYYY"), (err) => {
        //         console.log("directory exists")
        //     })
        // } catch {
        // console.log(req.body)
        //     fs.mkdir("./public/" + moment().format("DD_MM_YYYY"), { recursive: true }, (err) => {
        //         if (err) throw err;
        //     });
        // }
        cb(null, config.uploadPath + "/contentLinks");
    },
    filename:(req, file, cb) => {
        cb(null, nanoid() + (file.originalname !== "blob" ? path.extname(file.originalname) : ".jpg"));
    }
});
const upload = multer({storage});


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

    router.get('/lastJob', async(req, res) => {
        try {
            const lastJob = await BigBrother.findOne({stopScreen: null})
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

    router.post('/', upload.single('image'), async (req, res) => {
        try {
            const lastJob = await BigBrother.findOne({stopScreen: null})
            if (lastJob) {
                lastJob.stopScreen = req.file.filename
                const duration = moment.duration(moment().valueOf() - lastJob.startTime)
                lastJob.totalTime = `${duration.hours()}:${duration.minutes()}:${duration.seconds()}`
                lastJob.startTime = moment(lastJob.startTime, "x").format("DD-MM-YYYY_HH:mm:ss")
                lastJob.stopTime = moment().format("DD-MM-YYYY_HH:mm:ss")

                lastJob.save({ validateBeforeSave: false });
            }
            else {
                const bBrother = await new BigBrother()
                bBrother.startScreen = req.file.filename
                bBrother.startTime = moment().valueOf()
                bBrother.merchant = req.body.merchant
                bBrother.user = req.body.user

                bBrother.save({ validateBeforeSave: false });
            }
            res.send({message: "success"});
        } catch (err) {
            res.status(400).send({ message: err });
        }
    });

module.exports = router;