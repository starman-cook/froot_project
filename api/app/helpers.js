const Payment = require('./models/Payment');
const ExcelJS = require('exceljs');
const moment = require('moment');

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
    

    // buildContentlinksReportExcelFile: async () => {
    //
    //     const workbook = new ExcelJS.Workbook();
    //     let worksheet = workbook.addWorksheet('bigBrothers');
    //
    //     worksheet.columns = [
    //         { header: 'Id', key: '_id', width: 10 },
    //         { header: 'Name', key: 'name', width: 30 },
    //         { header: 'Address', key: 'address', width: 30},
    //         { header: 'Age', key: 'age', width: 10, outlineLevel: 1}
    //     ];
    //     worksheet.addRows([{id: 1, name: "jerk", adress: "some", age: 12},
    //         {id: 2, name: "jerk2", adress: "some2", age: 122},
    //         {id: 3, name: "jerk3", adress: "some3", age: 123},
    //         {id: 4, name: "jerk4", adress: "some4", age: 124}]);
    //     workbook.xlsx.writeFile("bigBrothers.xlsx")
    //         .then(function() {
    //             console.log("file saved!");
    //         });

        //     const workbook = new ExcelJS.Workbook();
    //     //для эффективного использования ресурсов и минимальной нагрузки при создании эксель-файла - ниже код который создает из массива 'contentlinks' объект - в качестве ключей используются айди юзеров, а значения - массив с индексами, которые получены по юзерам из 'contentlinks' - при вызове функции система только ОДИН раз проходит по массиву 'contentlinks, СТРУКТУРИРУЕТ его содержимое в объект из ключей которого собирает файл без необходимости повторного перебора массива для каждой вкладки
    //
    //     // let usersObj = contentlinks.reduce((acc, cur) => ({ ...acc, [cur.user]: [] }), {});
    //     // contentlinks.map((item, idx) => usersObj[item.user].push(idx));
    //
    //     // создать объект с уникальными ключами из айди юзеров и значениями из пустого массива и данными юзера
    //     let usersObj = contentlinks.reduce((acc, cur) => ({ ...acc, [cur.user._id]: { "contentlinksIdx": [], "userData": cur.user, "userContentlinks": [] } }), {});
    //     // запушить индексы по соотвествующим юзерам в пустые массивы созданного на предыдущем шаге объекта
    //     // contentlinks.map((item, idx) => usersObj[item.user._id].contentlinksIdx.push(idx));
    //
    //     contentlinks.map((item, idx) => {
    //         const user = usersObj[item.user._id];
    //         user.contentlinksIdx.push(idx);
    //         user.userContentlinks.push(item);
    //     });
    //
    //
    //     //для каждого юзера создать вкладку в эксель файле с именем этого юзера
    //     //во вкладке юзера создать таблицу со столбцами: #(id ссылки), ссылка, повтор(да / нет), начата(дата - время), завершена(дата - время), минут
    //
    //     const sheetHeaders = [
    //         { header: 'Id', width: 30 },
    //         { header: 'ФИО менеджера', width: 30 },
    //         { header: 'Ссылка', width: 60 },
    //         { header: 'Повтор', width: 10 },
    //         { header: 'Начата', width: 25 },
    //         { header: 'Завершена', width: 25 },
    //         { header: 'Минут', width: 10 },
    //     ];
    //
    //     for (let user in usersObj) {
    //         const sheet = workbook.addWorksheet(`${usersObj[user].user.workEmail}`);
    //         sheet.columns = sheetHeaders;
    //         usersObj[user].contentlinksIdx.map(idx => {
    //             const contentlink = contentlinks[idx];
    //
    //             const surname = usersObj[user].user.surname;
    //             const name = usersObj[user].user.name;
    //
    //             const contentlinkRepeat = contentlink.repeats.length ? 'да' : 'нет';
    //
    //             const startdate = moment(contentlink.startTime);
    //             const stopdate = contentlink.stopTime ? moment(contentlink.stopTime) : null; /// ???
    //
    //             const contentlinkDurationInMinutes = contentlink.duration
    //             const newRow = [contentlink._id, `${surname} ${name}`, contentlinkRepeat, startdate, stopdate, contentlinkDurationInMinutes];
    //             let row = sheet.addRow(newRow);
    //
    //             //подкрасить ссылку в зависимости от кол - ва минут
    //             let color = 'FFFFFF';
    //             switch (true) {
    //                 case (contentlinkDurationInMinutes < 1):
    //                     color = 'BBA8FF';
    //                     break;
    //                 case (contentlinkDurationInMinutes >= 1 && contentlinkDurationInMinutes < 3):
    //                     color = 'A8C7FF';
    //                     break;
    //                 case (contentlinkDurationInMinutes >= 3 && contentlinkDurationInMinutes < 5):
    //                     color = 'A8FFFB';
    //                     break;
    //                 case (contentlinkDurationInMinutes >= 5 && contentlinkDurationInMinutes < 7):
    //                     color = 'B2FFA8';
    //                     break;
    //                 case (contentlinkDurationInMinutes >= 7 && contentlinkDurationInMinutes < 10):
    //                     color = 'FFEEA8';
    //                     break;
    //                 case (contentlinkDurationInMinutes >= 10 && contentlinkDurationInMinutes < 15):
    //                     color = 'FFC5A8';
    //                     break;
    //                 case (contentlinkDurationInMinutes >= 15):
    //                     color = 'FFA8A8';
    //                     break;
    //                 default:
    //                     return;
    //             }
    //             row.fill = {
    //                 type: 'pattern',
    //                 pattern: 'solid',
    //                 fgColor: {
    //                     argb: color
    //                 }
    //             }
    //             // row.eachCell(function(cell) {
    //             //     cell.fill = {
    //             //         type: 'pattern',
    //             //         pattern:'solid',
    //             //         fgColor:{ argb:'deeded'}
    //             //     };
    //             // }
    //         });
    //     };
    //
    //     const filename = 'ContentReport_' + moment().format('DD-MM-YYYY') + '.xlsx';
    //     await workbook.xlsx.writeFile('./public/files/' + filename);
    //
    //     return usersObj;
    // }
}

