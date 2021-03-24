"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyImage = exports.createTextForMessage = exports.getChatId = void 0;
function getChatId(msg) {
    return msg.chat.id;
}
exports.getChatId = getChatId;
function createTextForMessage(data, head, subHead, withId) {
    return "\n<strong>" + head + "</strong>\n\n<i>" + subHead + "</i>\n\n<b>\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044F: </b>      <pre>" + data.priority + "</pre>\n<b>\u0421\u0442\u0430\u0442\u0443\u0441: </b>         <pre>" + (data.approved ? "Подтверждена" : data.paided ? "Оплачен" : "Еще не подтверждена") + "</pre>\n<b>\u041D\u0430\u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435: </b>     <pre>" + data.purpose + "</pre>\n<b>\u041F\u043B\u0430\u0442\u0435\u043B\u044C\u0449\u0438\u043A: </b>     <pre>" + data.payer + "</pre>\n<b>\u041A\u043E\u043D\u0442\u0440\u0430\u043A\u0442\u043E\u0440: </b>     <pre>" + data.contractor + "</pre>\n<b>\u0414\u0430\u0442\u0430 \u043F\u043B\u0430\u0442\u0435\u0436\u0430: </b>   <pre>" + data.dateOfPayment + "</pre>\n<b>\u0421\u0443\u043C\u043C\u0430: </b>          <pre>" + data.sum + " \u0442\u0433</pre>\n" + (withId ? "<b>id: </b>             <pre>" + data._id + "</pre>" : null) + "\n    ";
}
exports.createTextForMessage = createTextForMessage;
function applyImage(imageReq, fs) {
    var image;
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
