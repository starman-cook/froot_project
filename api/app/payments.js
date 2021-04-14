const helpers = require('./helpers');
const express = require('express');
const router = express.Router();
const auth = require('./middleware/auth.js');
const upload = require('./middleware/upload.js');
const permit = require('./middleware/permit.js');
const axios = require('axios');
const moment = require('moment')
const Payment = require('./models/Payment');
const config = require('./config');
const schedule = require('node-schedule');

const today = moment().format('YYYY-MM-DD') 

schedule.scheduleJob("16 21 * * *", async  function(){
    try {
        const payments = await Payment.find({dateOfNotification: today}).populate('user', 'surname name workEmail')
        payments.map(payment => {
            axios.post(config.baseUrlForTelegram + `:8001/telegram/${payment.user._id}/notification`, payment);
        })
    } catch (e) {
        console.log(e)
    }
});

const createRouter = () => {
    
    router.get('/', [auth, permit('viewAllPayments')], async (req, res) => {
        let filter = {}
        if (req.query.date) {
            filter.dateOfPayment = req.query.date
        }
        try {
            const payments = await Payment.find(filter).populate('user', 'surname name workEmail')
            res.send(payments);
        } catch (e) {
            res.status(500).send(e);
        }
    });

    router.get('/:id', [auth, permit('viewAllPayments')], async (req, res) => {
        try {
            const payment = await Payment.findOne({ _id: req.params.id });
            res.send(payment);
        } catch (e) {
            res.status(400).send(e);
        }
    });

    router.post('/', [auth, permit('viewAllPayments', 'addPayment'), upload.single('image')], async (req, res) => {
        try {
            const payment = new Payment(req.body);
            if (req.file) {
                payment.image = req.file.filename;
            }
            
            const momentObj = moment(payment.dateOfPayment, 'YYYY-MM-DD')
            payment.dateOfNotification = momentObj.subtract(payment.noticePeriod, 'days').format('YYYY-MM-DD')

            payment.user = req.user._id;
            if (payment.repeatability) payment.repeatabilityId = payment._id;
            await payment.save();
            axios.post(config.baseUrlForTelegram + ':8001/telegram', payment);
            res.send(payment);
        } catch (err) {
            res.status(400).send({ message: err });
        }
    });

    router.post('/filter', [auth, permit('viewAllPayments')], async (req, res) => {
        try {
            let obj = {};
            Object.keys(req.body).map(key => {
                if (key === "dateOfPayment" && req.body.dateOfPayment !== "") {
                    obj.dateOfPayment = {
                        $gte: req.body.dateOfPayment.fromDate,
                        $lte: req.body.dateOfPayment.toDate
                    }
                }
                else if (req.body[key] !== "") {
                    obj[key] = req.body[key];
                }
            })
            const payments = await Payment.find(obj).populate('user', 'surname name workEmail')
            res.send(payments);
        } catch (e) {
            res.status(500).send(e);
        }
    });

    router.get('/:id/approved', [auth, permit('approvePayment')], async (req, res) => {
        const payment = await Payment.findById(req.params.id).populate('user', 'surname name workEmail')
        payment.approved = true;
        try {
            await payment.save();
            axios.post(config.baseUrlForTelegram + `:8001/telegram/${payment.user._id}/approved`, payment);
            res.send(payment);
        } catch (e) {
            res.status(400).send(e);
        }
    });

    router.get('/:id/approved/cancel', [auth, permit('approvePayment')], async (req, res) => {
        const payment = await Payment.findById(req.params.id).populate('user', 'surname name workEmail')
        if (!payment.paided) {
            payment.approved = false;
        } else {
            return res.status(403).send({ 'message': 'Нельзя отменить! Платеж уже оплачен' });
        };
        try {
            await payment.save();
            axios.post(config.baseUrlForTelegram + `:8001/telegram/${payment.user._id}/approved/cancel`, payment);
            res.send(payment);
        } catch (e) {
            res.status(400).send(e);
        }
    });

    router.get('/:id/paid', [auth, permit('payPayment')], async (req, res) => {
        const payment = await Payment.findById(req.params.id).populate('user', 'surname name workEmail')
        if (payment.approved) {
            payment.paided = true;
        } else {
            return res.status(403).send({ 'message': 'Требуется одобрение директора' })
        };
        try {
            await payment.save();
            axios.post(config.baseUrlForTelegram + `:8001/telegram/${payment.user._id}/paid`, payment);
            res.send(payment);
        } catch (e) {
            res.status(400).send(e);
        }
    });

    router.get('/:id/paid/cancel', [auth, permit('payPayment')], async (req, res) => {
        const payment = await Payment.findById(req.params.id)
        payment.paided = false;
        try {
            await payment.save();
            axios.post(config.baseUrlForTelegram + `:8001/telegram/${payment.user._id}/paid/cancel`, payment);
            res.send(payment);
        } catch (e) {
            res.status(400).send(e);
        }
    });

    router.get('/:id/date', [auth, permit('postponePayment')], async (req, res) => {
        const payment = await Payment.findById(req.params.id)
        const today = new Date();

        const tomorrow = today.setDate(today.getDate() + 1);
        payment.dateOfPayment = tomorrow
        try {
            await payment.save();
            await axios.post(config.baseUrlForTelegram + `:8001/telegram/${payment.user._id}/date`, payment);
            res.send(payment);
        } catch (e) {
            res.status(400).send(e);
        }
    });

    router.put('/:id/edit', [auth, permit('editPayment'), upload.single('image')], async (req, res) => {
        const payment = await Payment.findByIdAndUpdate(req.params.id, { $set: req.body }, { useFindAndModify: false }, function (err, result) {
            if (err) {
                console.log(err);
            }
        });
        if (req.file) {
            payment.image = req.file.filename;
        };
        await payment.save();
        res.send(payment);
    });

    router.get('/due/today', [auth, permit('viewTodayPayments')], async (req, res) => {
        let filter = {
            dateOfPayment: {
                $lte: moment().format('YYYY-MM-DD')
            },
            paided: false
        };
        try {
            const payments = await Payment.find(filter).populate('user', 'surname name workEmail');
            await helpers.checkRepeatability(payments)
            await helpers.buildExcelFile(payments)
            res.send(payments);
        } catch (e) {
            res.status(500).send(e);
        }
    });
    router.get('/files/today', [auth, permit('payPayment')], async (req, res) => {
        let filter = {
            dateOfPayment: {
                $lte: moment().format('YYYY-MM-DD')
            },
            approved: true
        };
        try {
            const payments = await Payment.find(filter).populate('user', 'surname name workEmail');
            let files = []
            payments.map(p=>{
                if(p.image){
                    files.push(p.image)
                }                
            })
            res.send(files);
        } catch (e) {
            res.status(500).send(e);
        }
    });
    router.get('/due/to-be-paid', [auth, permit('viewToBePaid')], async (req, res) => {
        let filter = { paided: false, approved: true };
        try {
            const payments = await Payment.find(filter).populate('user', 'surname name workEmail');
            await helpers.buildExcelFile(payments)
            res.send(payments);
        } catch (e) {
            res.status(500).send(e);
        }
    });

    router.get('/telegram/:id/approved', [auth, permit('approvePayment')], async (req, res) => {
        try {
            const payment = await Payment.findById(req.params.id)
            payment.approved = 'true'
            await payment.save();
            await axios.post(config.baseUrlForTelegram + `:8001/telegram/${payment.user._id}/approved`, payment);
            res.send({ message: "Платеж одобрен, оплатить!", payment });
        } catch (error) {
            res.status(404).send({ message: "Not found" });
        }
    });

    router.get('/telegram/:id/date', [auth, permit('postponePayment')], async (req, res) => {
        try {
            const payment = await Payment.findById(req.params.id)
            const momentObj = moment(payment.dateOfPayment, 'YYYY-MM-DD')
            const tomorrow = momentObj.add(1, 'days').format('YYYY-MM-DD')
            payment.dateOfPayment = tomorrow
            await payment.save();
            await axios.post(config.baseUrlForTelegram + `:8001/telegram/${payment.user._id}/date`, payment);
            res.send({ message: "Платеж пeренесен на завтра", payment });
        } catch (error) {
            res.status(404).send({ message: "Not found" });
        }
    });

    router.delete('/:id/delete', [auth, permit('deletePayment')], async (req, res) => {
        const payment = await Payment.findById(req.params.id);
        try {
            payment.deleteOne();
        } catch (error) {
            res.send(error);
        }
        res.send({ message: 'payment deleted!', _id: payment._id });
    });

    router.post('/:id/not-repeatability', [auth, permit('stopRepeatabilityPayment')], async (req,res) => {
        let filter ={_id: req.params.id};
        req.user.position!=='директор' ? filter.user = req.user._id: null;
        const payment = await Payment.findOne({...filter}).populate('user', 'surname name workEmail');
        try {
            if (!payment) return res.status(500).send({message: 'Not your payment'});
            payment.repeatability = false;
            payment.save();
            
            res.send(payment)
        } catch(e) {
            res.status(500).send(e);
        }
    })

    return router;
}
module.exports = createRouter;
