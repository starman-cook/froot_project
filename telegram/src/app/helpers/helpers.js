"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKeyBoard = exports.applyImage = exports.createTextForMessage = exports.getChatId = void 0;
const keyboard_1 = require("./keyboard");
// Эта функция просто возвращает чат id
function getChatId(msg) {
    return msg.chat.id;
}
exports.getChatId = getChatId;
// Эта функция просто собирает стандартный текст для caption од изображением, здесь все детали по заявке
function createTextForMessage(data, head, subHead, withId) {
    return `
<strong>${head}</strong>

<i>${subHead}</i>

<b>Категория: </b>      <pre>${data.priority}</pre>
<b>Статус: </b>         <pre>${data.approved ? "Подтверждена" : data.paided ? "Оплачен" : "Еще не подтверждена"}</pre>
<b>Назначение: </b>     <pre>${data.purpose}</pre>
<b>Плательщик: </b>     <pre>${data.payer}</pre>
<b>Контрактор: </b>     <pre>${data.contractor}</pre>
<b>Дата платежа: </b>   <pre>${data.dateOfPayment}</pre>
<b>Сумма: </b>          <pre>${data.sum} тг</pre>
${withId ? `<b>id: </b>             <pre>${data._id}</pre>` : ""}
    `;
}
exports.createTextForMessage = createTextForMessage;
// Эта функция определяет определяет есть ли изображение, и если нет, то ставит дефолтное
function applyImage(imageReq, fs) {
    let image;
    if (imageReq) {
        if (fs.existsSync('./public/images/' + imageReq)) {
            image = './public/images/' + imageReq;
        }
        else {
            image = './public/images/default.png';
        }
    }
    else {
        image = './public/images/default.png';
    }
    return image;
}
exports.applyImage = applyImage;
// Эта функция определяет какую клавиатуру показать на экране
function getKeyBoard(user) {
    let keyB;
    if (!user)
        keyB = keyboard_1.mainKb.home;
    if (user.role.includes('viewTodayPayments') && user.role.includes('viewToBePaid'))
        keyB = keyboard_1.mainKb.homeMaster;
    else if (user.role.includes('viewTodayPayments'))
        keyB = keyboard_1.mainKb.homeDirector;
    else if (user.role.includes('viewToBePaid'))
        keyB = keyboard_1.mainKb.homeAccountant;
    return keyB;
}
exports.getKeyBoard = getKeyBoard;
