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
const logger=config.log4jsApi.getLogger("api");

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

    router.get('/', auth, async (req, res) => {
        
        try {
            const payments = await Payment.find().populate('user', 'surname name workEmail').sort({dateOfPayment: -1});
            res.send(payments);
        } catch (e) {
            logger.error('GET /payments '+ e);
            res.status(500).send(e);
        }
    });

    router.get('/:id', [auth, permit('viewAllPayments')], async (req, res) => {
        try {
            const payment = await Payment.findOne({ _id: req.params.id });
            res.send(payment);
        } catch (e) {
            logger.error('GET /payments/:id '+e);
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

            payment.user = req.user._id
            if (payment.repeatability) payment.repeatabilityId = payment._id;
            await payment.save();
            if (process.env.NODE_ENV !== 'test') {
                try {

                    await axios.post(config.baseUrlForTelegram + ':8001/telegram', payment);

                } catch (err) {
                    console.log(err)
                }
            }

            res.send(payment);
        } catch (err) {
            logger.error('POST /payments '+ err);
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
            logger.error('POST /payments/filter '+e);
            res.status(500).send(e);
        }
    });

    router.get('/:id/approved', [auth, permit('approvePayment')], async (req, res) => {
        const payment = await Payment.findById(req.params.id).populate('user', 'surname name workEmail')
        payment.approved = true;
        try {
            await payment.save();
            if (process.env.NODE_ENV !== 'test') {
                try {

                    await axios.post(config.baseUrlForTelegram + `:8001/telegram/${payment.user._id}/approved`, payment);

            } catch (err) {
                console.log(err)
            }  }

            res.send(payment);
        } catch (e) {
            logger.error('GET /payments/:id/approved '+e);
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
            if (process.env.NODE_ENV !== 'test') {
                try {

                    await axios.post(config.baseUrlForTelegram + `:8001/telegram/${payment.user._id}/approved/cancel`, payment);

            } catch (err) {
                console.log(err)
            }
        }
            res.send(payment);
        } catch (e) {
            logger.error('GET /payments/:id/approved/cancel '+e);
            res.status(400).send(e);
        }
    });

    router.get('/:id/paid', [auth, permit('payPayment')], async (req, res) => {
        const payment = await Payment.findById(req.params.id).populate('user', 'surname name workEmail')
        if (payment.approved) {
            payment.paided = true;
        } else {
            return res.status(403).send({ 'message': 'Требуется одобрение директора' })
        }
        try {
            await payment.save();
            if (process.env.NODE_ENV !== 'test') {
                try {

                    await axios.post(config.baseUrlForTelegram + `:8001/telegram/${payment.user._id}/paid`, payment);

            } catch (err) {
                console.log(err)
            }
            }

            res.send(payment);
        } catch (e) {
            logger.error('GET /payments/:id/paid '+e);
            res.status(400).send(e);
        }
    });

    router.get('/:id/paid/cancel', [auth, permit('payPayment')], async (req, res) => {
        const payment = await Payment.findById(req.params.id)
        payment.paided = false;
        try {
            await payment.save();
            if (process.env.NODE_ENV !== 'test') {
                try {

                    await axios.post(config.baseUrlForTelegram + `:8001/telegram/${payment.user._id}/paid/cancel`, payment);

            } catch (err) {
                console.log(err)
            }
            }
            res.send(payment);
        } catch (e) {
            logger.error('GET /payments/:id/paid/cancel '+e);
            res.status(400).send(e);
        }
    });

    router.put('/:id/edit', [auth, permit('editPayment'), upload.single('image')], async (req, res) => {

        try{
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
        }
        catch(e){
            logger.error('PUT /payments/:id/edit '+e);
            res.status(400).send(e);
        }
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
            if (process.env.NODE_ENV !== 'test') {
                await helpers.checkRepeatability(payments)
                await helpers.buildExcelFile(payments)
            }
            res.send(payments);
        } catch (e) {
            logger.error('GET /payments/due/today '+e);
            res.status(500).send(e);
        }
    });
    router.get('/due/today/telegram', [auth, permit('viewTodayPayments')], async (req, res) => {
        let filter = {
            dateOfPayment: {
                $lte: moment().format('YYYY-MM-DD')
            },
            paided: false,
            approved: false
        };
        try {
            const payments = await Payment.find(filter).populate('user', 'surname name workEmail');
            if (process.env.NODE_ENV !== 'test') {
                await helpers.checkRepeatability(payments)
            }
            res.send(payments);
        } catch (e) {
            logger.error('GET /payments/due/today/telegram '+e);
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
            payments && payments.map(p=>{
                if(p.image){
                    files.push(p.image)
                }                
            })
            res.send(files);
        } catch (e) {
            logger.error('GET /payments/files/today '+e);
            res.status(500).send(e);
        }
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
            logger.error('POST /payments/:id/not-repeatability '+e);
            res.status(500).send(e);
        }
    })

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

    router.delete('/:id/delete', [auth, permit('deletePayment')], async (req, res) => {
        try {
            const payment = await Payment.findById(req.params.id);
            payment.deleteOne();
            res.send({ message: 'payment deleted!', _id: payment._id });
        } catch (error) {
            res.send(error);
        }
    });

    router.get('/telegram/:id/approved', [auth, permit('approvePayment')], async (req, res) => {
        try {
            const payment = await Payment.findById(req.params.id)
            payment.approved = 'true'
            await payment.save();
            try {
                await axios.post(config.baseUrlForTelegram + `:8001/telegram/${payment.user._id}/approved`, payment);
            } catch (err) {
                console.log(err)
            }
            res.send({ message: "Платеж одобрен, оплатить!", payment });
        } catch (error) {
            logger.error('GET /payments/telegram/:id/approved '+error);
            res.status(404).send({ message: "Not found" });
        }
    });
    router.get('/telegram/:id/date', [auth, permit('postponePayment')], async (req, res) => {
        try {
            const payment = await Payment.findById(req.params.id)
            const tomorrow = moment().add(1, 'days').format('YYYY-MM-DD')
            payment.dateOfPayment = tomorrow
            await payment.save();
            try {
                await axios.post(config.baseUrlForTelegram + `:8001/telegram/${payment.user._id}/date`, payment);
            } catch (err) {
                console.log(err)
            }
            res.send({ message: "Платеж пeренесен на завтра", payment });
        } catch (error) {
            logger.error('GET /payments/telegram/:id/date '+error);
            res.status(404).send({ message: "Not found" });
        }
    });
    
    return router;
}
module.exports = createRouter;

