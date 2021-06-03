
const express = require('express');
const router = express.Router();
const moment = require('moment')
const BigBrother = require('./models/BigBrother');
const User = require('./models/User')
const multer = require('multer');
const auth = require('./middleware/auth')
const permit = require('./middleware/permit')
const helpers = require('./helpers');
multer({
    limits: { fieldSize: 2 * 1024 * 1024 }
})
const upload = multer();

router.get('/all', [auth, permit('viewAllContentlinks')], async(req, res) => {
    try {
        let jobs = await BigBrother.find().sort({createdAt: -1}).skip((req.query.page - 1) * 10).limit(10)
        const count = await BigBrother.countDocuments()
        res.send({jobs: jobs, count: count})
    } catch (err) {
        res.status(400).send({ message: err });
    }
})

router.get('/single', [auth, permit('viewAllContentlinks', 'viewOwnContentlinks')], async(req, res) => {
    try {
        const jobs = await BigBrother.find({user: req.query.userId}).populate("User").sort({createdAt: -1}).skip((req.query.page - 1) * 10).limit(10)
        const count = await BigBrother.find({user: req.query.userId}).populate("User").countDocuments()
        res.send({jobs: jobs, count: count})
    } catch (err) {
        res.status(400).send({ message: err });
    }
})


router.get('/:userId/lastJob', async(req, res) => {
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
    try {
        const user = await User.findById(req.body.user)
        const lastJob = await BigBrother.findOne({user: req.body.user, stopScreen: null})
        if (lastJob) {

            lastJob.stopScreen = req.body.image
            const duration = moment.duration(moment().valueOf() - lastJob.startTime)
            lastJob.totalTime = `${duration.hours()}:${duration.minutes()}:${duration.seconds()}`
            lastJob.startTime = moment(lastJob.startTime, "x").format("DD-MM-YYYY HH:mm:ss")
            lastJob.stopTime = moment().format("DD-MM-YYYY HH:mm:ss")

            lastJob.save({ validateBeforeSave: false });
        }
        else {
            const bBrother = await new BigBrother()
            bBrother.startScreen = req.body.image
            bBrother.startTime = moment().valueOf()
            bBrother.merchant = req.body.merchant
            bBrother.user = req.body.user
            bBrother.userName = `${user.name} ${user.surname}`
            bBrother.save({ validateBeforeSave: false });
        }
        res.send({message: "success"});
    } catch (err) {
        res.status(400).send({ message: "err" });
    }
});

// router.get('/excel', [auth, permit('viewAllContentlinks')], async (req, res) => {
//         // const filter = {
//         //     createdAt: {
//         //         $gte: moment().subtract(30, 'day')
//         //     }
//         // };
//         // try {
//             // const contentLinks = await BigBrother.find(filter).populate('user');
//
//
//             // if (process.env.NODE_ENV !== 'test') {
//             // const contentLinksByUsers = await helpers.buildContentlinksReportExcelFile(contentLinks);
//                 await helpers.buildContentlinksReportExcelFile();
//             res.send("contentLinksByUsers");
//             // }else{
//             //     res.send("contentLinks")
//             // }
//         // } catch (error) {
//         //     res.status(500).send(error);
//         //     console.log("MOTHER FUCK!")
//         // }
//     });

module.exports = router;
