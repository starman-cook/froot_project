const express = require('express');
const router = express.Router();
const auth = require('./middleware/auth.js');
const upload = require('./middleware/upload.js');
const permit = require('./middleware/permit.js');
const axios = require('axios');
const moment = require('moment')
const Payment = require('./models/Payment');
const ExcelJS = require('exceljs');
const config = require('./config');


const createRouter = () => {
    router.get('/', async (req, res) => {
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

    router.get('/:id', async (req, res) => {
        try {
            const payment = await Payment.findOne({ _id: req.params.id });
            res.send(payment);
        } catch (e) {
            res.status(400).send(e);
        }
    });

    router.post('/', [auth, upload.single('image')], async (req, res) => {
        try {

            const payment = new Payment(req.body);
            if (req.file) {
                payment.image = req.file.filename;
            }
            payment.user = req.user._id;
            if (payment.repeatability) payment.repeatabilityId = payment._id;
            await payment.save();
            axios.post(config.baseUrlForTelegram + ':8001/telegram', payment);
            res.send(payment);
        } catch (err) {
            res.status(400).send({message: err});
        }
    });
    router.post('/filter', async (req, res) => {
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
    router.post('/:id/approved', [auth, permit('director')], async (req, res) => {
        const payment = await Payment.findById(req.params.id).populate('user', 'surname name workEmail')
        payment.approved = 'true'
        try {
            await payment.save();
            axios.post(config.baseUrlForTelegram + `:8001/telegram/${payment.user}/approved`, payment);
            res.send(payment);
        } catch (e) {
            res.status(400).send(e);
        }
    });
    router.post('/:id/paid', [auth, permit('accountant')], async (req, res) => {
        const payment = await Payment.findById(req.params.id)
        if (payment.approved) {
            payment.paided = 'true'
        } else {
            res.status(403).send({ 'message': 'Требуется одобрение директора' })
        };
        try {
            await payment.save();
            // axios.post(config.baseUrlForTelegram + ':8001/telegram/:id/paid', { message: "Платеж оплачен!", payment });
            res.send(payment);
        } catch (e) {
            res.status(400).send(e);
        }
    });
    router.post('/:id/date', [auth], async (req, res) => {
        const payment = await Payment.findById(req.params.id)
        const today = new Date();

        const tomorrow = today.setDate(today.getDate() + 1);
        payment.dateOfPayment = tomorrow
        try {
            await payment.save();
            axios.post(config.baseUrlForTelegram + `:8001/telegram/${payment.user}/date`, payment);
            res.send(payment);
        } catch (e) {
            res.status(400).send(e);
        }
    });

    router.get('/due/today', [auth, permit('director', 'accountant')], async (req, res) => {
        let filter = { dateOfPayment: moment().format('YYYY-MM-DD'), approved: false };
        try {
            const payments = await Payment.find(filter).populate('user', 'surname name workEmail');

            payments.map(async item => {
                if (item.repeatability && !item.repeatabilityClosed && !item.repeatabilityApplied) {
                    let nextPayment;

                    let itemCopy = item.toObject();
                    delete itemCopy._id;

                    const startdate = moment(itemCopy.dateOfPayment, 'YYYY-MM-DD');
                    let newdate;
                    switch (itemCopy.periodicity) {
                        case 'weekly':
                            newdate = startdate.add(7, 'days').format('YYYY-MM-DD');
                            break;
                        case 'monthly':
                            newdate = startdate.add(1, 'M').format('YYYY-MM-DD');
                            break;
                        default:
                            return;
                    };
                    itemCopy.dateOfPayment = newdate;
                    nextPayment = new Payment(itemCopy);

                    await nextPayment.save();

                    const payment = await Payment.findById(item._id);
                    payment.repeatabilityApplied = true;
                    payment.save();
                };
            });

            const workbook = new ExcelJS.Workbook();
            const sheet = workbook.addWorksheet('Today');

            sheet.getRow(1).font = { name: 'Times New Roman', size: 14, bold: true };
            sheet.columns = [
                { header: 'Id', width: 30 },
                { header: 'Дата', width: 15 },
                { header: 'Компания', width: 20 },
                { header: 'Назначение', width: 15 },
                { header: 'Номер договора/счета', width: 25 },
                { header: 'Контрагент', width: 15 },
                { header: 'Условия', width: 15 },
                { header: 'Дни', width: 15 },
                { header: 'Сумма', width: 15 },
                { header: 'Приоритет', width: 15 },
                { header: 'Инициатор', width: 25 }
            ];
            payments.map(item => {
                const newRow = [item._id, item.dateOfPayment, item.payer, item.purpose, item.invoice, item.contractor, '', '', item.sum, item.priority, item.user.workEmail];
                sheet.addRow(newRow);
            });

            const filename = (moment().format('YYYY-MM-DD') + '.xlsx');
            await workbook.xlsx.writeFile('./public/files/' + filename);

            res.send(payments);
        } catch (e) {
            res.status(500).send(e);
        }
    });

    router.put('/:id/edit', [auth, permit('admin', 'accountant', 'director'), upload.single('image')], async (req, res) => {
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

    router.post('/telegram/:id/approved', async (req, res) => {
        try {
            const payment = await Payment.findById(req.params.id)
            payment.approved = 'true'
            await payment.save();
            axios.post(config.baseUrlForTelegram + `:8001/telegram/${payment.user}/approved`, payment);
            res.send({ message: "Платеж одобрен, оплатить!", payment });
        } catch (error) {
            res.status(404).send({ message: "Not found" });
        }
    });
    router.post('/telegram/:id/date', async (req, res) => {
        try {
            const payment = await Payment.findById(req.params.id)
            const momentObj = moment(payment.dateOfPayment, 'YYYY-MM-DD')
            const tomorrow = momentObj.add(1, 'days').format('YYYY-MM-DD')
            payment.dateOfPayment = tomorrow
            await payment.save();
            axios.post(config.baseUrlForTelegram + `:8001/telegram/${payment.user}/date`, payment);
            res.send({ message: "Платеж пeренесен на завтра", payment });
        } catch (error) {
            res.status(404).send({ message: "Not found" });
        }
    });

    router.delete('/:id/delete', [auth, permit('admin')], async (req, res) => {
        const payment = await Payment.findById(req.params.id);
        try {
            payment.deleteOne();
        } catch (error) {
            res.send(error);
        }
        res.send({ message: 'payment deleted!', _id: payment._id });
    });

    return router;
}
module.exports = createRouter;
