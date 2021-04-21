const Payment = require('./models/Payment');
const ExcelJS = require('exceljs');
const moment = require('moment');
const puppeteer = require('puppeteer');

module.exports = {
    buildExcelFile: async (payments) => {
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
    },

    checkRepeatability: async (payments) => {

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
    },

    screenshot: async (url, name) => {
        const browser = await puppeteer.launch();
        const device_width = 1920;
        const device_height = 1080;
        const page = await browser.newPage();
        await page.setViewport({ width: device_width, height: device_height })
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        await page.screenshot({
            fullPage: true,
            path: `./public/uploads/${name}`
        });
        await browser.close();
    }
}

// export const buildExcelFile = async (payments) => {
//     const workbook = new ExcelJS.Workbook();
//     const sheet = workbook.addWorksheet('Today');
//
//     sheet.getRow(1).font = { name: 'Times New Roman', size: 14, bold: true };
//     sheet.columns = [
//         { header: 'Id', width: 30 },
//         { header: 'Дата', width: 15 },
//         { header: 'Компания', width: 20 },
//         { header: 'Назначение', width: 15 },
//         { header: 'Номер договора/счета', width: 25 },
//         { header: 'Контрагент', width: 15 },
//         { header: 'Условия', width: 15 },
//         { header: 'Дни', width: 15 },
//         { header: 'Сумма', width: 15 },
//         { header: 'Приоритет', width: 15 },
//         { header: 'Инициатор', width: 25 }
//     ];
//     payments.map(item => {
//         const newRow = [item._id, item.dateOfPayment, item.payer, item.purpose, item.invoice, item.contractor, '', '', item.sum, item.priority, item.user.workEmail];
//         sheet.addRow(newRow);
//     });
//
//     const filename = (moment().format('YYYY-MM-DD') + '.xlsx');
//     await workbook.xlsx.writeFile('./public/files/' + filename);
// }


// export const checkRepeatability = async (payments) => {
//
//     payments.map(async item => {
//         if (item.repeatability && !item.repeatabilityClosed && !item.repeatabilityApplied) {
//             let nextPayment;
//
//             let itemCopy = item.toObject();
//             delete itemCopy._id;
//
//             const startdate = moment(itemCopy.dateOfPayment, 'YYYY-MM-DD');
//             let newdate;
//             switch (itemCopy.periodicity) {
//                 case 'weekly':
//                     newdate = startdate.add(7, 'days').format('YYYY-MM-DD');
//                     break;
//                 case 'monthly':
//                     newdate = startdate.add(1, 'M').format('YYYY-MM-DD');
//                     break;
//                 default:
//                     return;
//             };
//             itemCopy.dateOfPayment = newdate;
//             nextPayment = new Payment(itemCopy);
//
//             await nextPayment.save();
//
//             const payment = await Payment.findById(item._id);
//             payment.repeatabilityApplied = true;
//             payment.save();
//         };
//     });
// }