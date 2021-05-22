const express = require('express');
const auth = require('./middleware/auth.js');
const permit = require('./middleware/permit.js');
const router = express.Router();
const moment = require('moment');
const helpers = require('./helpers');

const Contentlink = require('./models/Contentlink');

const createRouter = () => {
    router.post('/', [auth, permit('addContentlink')], async (req, res) => {
        try {
            let contentlink = await Contentlink.findOne({ url: req.body.url });
            if (contentlink && contentlink.stopdate) {
                contentlink.repeats.unshift({ startdate: contentlink.startdate, stopdate: contentlink.stopdate, startscreen: contentlink.startscreen, stopscreen: contentlink.stopscreen }) // на фронте - если выводить сообщение о повторе с указанием предыдущей записи - то брать всегда 0-вой элемент массива
                contentlink.startdate = moment().format();
                contentlink.stopdate = null;
                contentlink.startscreen = contentlink._id + '__' + moment().format('DD-MM-YYYY-HH-mm-ss') + '.png';
                contentlink.stopscreen = null;
                await helpers.screenshot(req.body.url, contentlink.startscreen);
            } else if (contentlink && !contentlink.stopdate) {
                contentlink.stopdate = moment().format();
                contentlink.stopscreen = contentlink._id + '__' + moment().format('DD-MM-YYYY-HH-mm-ss') + '.png';
                await helpers.screenshot(req.body.url, contentlink.stopscreen);
            } else {
                contentlink = new Contentlink({ ...req.body, ...{ user: req.user._id } });
                contentlink.startdate = moment().format();
                contentlink.startscreen = contentlink._id + '__' + moment().format('DD-MM-YYYY-HH-mm-ss') + '.png';
                await helpers.screenshot(req.body.url, contentlink.startscreen);
            }
            await contentlink.save({ validateBeforeSave: false });
            res.send(contentlink);
        } catch (error) {
            res.status(500).send(error);
        }
    });
    router.get('/', [auth, permit('viewOwnContentlinks')], async (req, res) => {
        const filter = {
            user: req.user,
            startdate: {
                $gte: moment().format('YYYY-MM-DD')
            }
        };
        try {
            const contentlinks = await Contentlink.find(filter).sort('-startdate');
            res.send(contentlinks);
        } catch (error) {
            res.status(500).send(error);
        }
    });
    router.get('/all', [auth, permit('viewAllContentlinks')], async (req, res) => {
        const filter = {
            startdate: {
                $gte: moment().subtract(30, 'day').format('YYYY-MM-DD')
            }
        };
        try {
            const contentlinks = await Contentlink.find(filter).populate('user', 'surname name workEmail');;
            if (process.env.NODE_ENV !== 'test') { 
            const contentlinksByUsers = await helpers.buildContentlinksReportExcelFile(contentlinks);
            res.send(contentlinksByUsers);
            }else{
                res.send(contentlinks)
            }
        } catch (error) {
            res.status(500).send(error);
        }
    });
    return router;
}

module.exports = createRouter;