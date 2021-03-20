"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var helpers_1 = require("./app/helpers/helpers");
var node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
var cors_1 = __importDefault(require("cors"));
var mongoose_1 = __importDefault(require("mongoose"));
var axios_1 = __importDefault(require("axios"));
var keyboard_1 = require("./app/helpers/keyboard");
var kb_1 = require("./app/helpers/kb");
var user_model_1 = require("./app/model/user-model");
var config_1 = require("./app/config");
var upload_1 = require("./app/upload");
mongoose_1.default.connect(config_1.config.mongoUrl.url + config_1.config.mongoUrl.bd, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(function () {
    console.log("Mongo connected");
})
    .catch(function (err) {
    console.log(err);
});
var app = express_1.default();
app.use(cors_1.default());
app.use(express_1.default.json());
var bot = new node_telegram_bot_api_1.default(config_1.config.telegramToken, {
    polling: {
        interval: 300,
        autoStart: true,
        params: {
            timeout: 10
        }
    }
});
app.post('/telegram', upload_1.upload.single('image'), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var http, fs, request, users, i, image, html;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (req.body.image) {
                    http = require('http'), fs = require('fs');
                    request = http.get(config_1.config.localApiUrl + "/uploads/" + req.body.image, function (response) {
                        if (response.statusCode === 200) {
                            var file = fs.createWriteStream("./public/images/" + req.body.image);
                            response.pipe(file);
                        }
                        // Add timeout.
                        request.setTimeout(12000, function () {
                            request.abort();
                        });
                    });
                }
                return [4 /*yield*/, user_model_1.User.find({})];
            case 1:
                users = _a.sent();
                try {
                    for (i = 0; i < users.length; i++) {
                        image = void 0;
                        if (req.body.image) {
                            image = './public/images/' + req.body.image;
                        }
                        else {
                            image = './public/images/default.png';
                        }
                        html = "\n                                <strong>Hello, " + users[i].name + "</strong>\n\n                                                    <i>\u041D\u043E\u0432\u0430\u044F \u0437\u0430\u044F\u0432\u043A\u0430:</i>\n\n<b>\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044F: </b>      <pre>" + req.body.priority + "</pre>\n<b>\u0421\u0442\u0430\u0442\u0443\u0441: </b>         <pre>" + (req.body.approved ? "Подтвержден" : req.body.paided ? "Оплачен" : "Еще не подтверждена") + "</pre>\n<b>\u041D\u0430\u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435: </b>     <pre>" + req.body.purpose + "</pre>\n<b>\u041F\u043B\u0430\u0442\u0435\u043B\u044C\u0449\u0438\u043A: </b>     <pre>" + req.body.payer + "</pre>\n<b>\u041A\u043E\u043D\u0442\u0440\u0430\u043A\u0442\u043E\u0440: </b>     <pre>" + req.body.contractor + "</pre>\n<b>\u0414\u0430\u0442\u0430 \u043F\u043B\u0430\u0442\u0435\u0436\u0430: </b>   <pre>" + req.body.dateOfPayment + "</pre>\n<b>\u0421\u0443\u043C\u043C\u0430: </b>          <pre>" + req.body.sum + " \u0442\u0433</pre>\n                            ";
                        bot.sendPhoto(users[i].chatId, image, {
                            caption: html,
                            parse_mode: 'HTML',
                            reply_markup: {
                                inline_keyboard: [
                                    [{
                                            text: 'Детали заявки',
                                            url: 'https://google.com'
                                        }],
                                    [{
                                            text: "Удалить из сообщений",
                                            callback_data: 'delete'
                                        }]
                                ]
                            }
                        });
                    }
                }
                catch (err) {
                    console.log(err);
                }
                return [2 /*return*/];
        }
    });
}); });
bot.on('callback_query', function (query) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, chat, message_id, text, id, captionArray, idLine, _b, err_1, err_2;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = query.message, chat = _a.chat, message_id = _a.message_id, text = _a.text;
                if (query.data === 'approve' || query.data === 'tomorrow') {
                    captionArray = query.message.caption.split("\n");
                    idLine = captionArray[captionArray.length - 1].replace(/\s+/g, ' ').trim();
                    id = idLine.split(" ")[1];
                }
                _b = query.data;
                switch (_b) {
                    case 'delete': return [3 /*break*/, 1];
                    case 'approve': return [3 /*break*/, 2];
                    case 'tomorrow': return [3 /*break*/, 6];
                }
                return [3 /*break*/, 10];
            case 1:
                bot.deleteMessage(chat.id, message_id.toString());
                return [3 /*break*/, 10];
            case 2:
                _c.trys.push([2, 4, , 5]);
                return [4 /*yield*/, axios_1.default.post(config_1.config.localApiUrl + "/payments/telegram/" + id + "/approved")];
            case 3:
                _c.sent();
                bot.sendMessage(query.message.chat.id, "\u0417\u0430\u044F\u0432\u043A\u0430 " + id + " \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0430");
                return [3 /*break*/, 5];
            case 4:
                err_1 = _c.sent();
                bot.sendMessage(query.message.chat.id, "\u0427\u0442\u043E-\u0442\u043E \u043F\u043E\u0448\u043B\u043E \u043D\u0435 \u0442\u0430\u043A \u0441 \u0437\u0430\u044F\u0432\u043A\u043E\u0439 " + id);
                throw new Error(err_1);
            case 5: return [3 /*break*/, 10];
            case 6:
                _c.trys.push([6, 8, , 9]);
                return [4 /*yield*/, axios_1.default.post(config_1.config.localApiUrl + "/payments/telegram/" + id + "/date")];
            case 7:
                _c.sent();
                bot.sendMessage(query.message.chat.id, "\u0417\u0430\u044F\u0432\u043A\u0430 " + id + " \u043F\u0435\u0440\u0435\u043D\u0435\u0441\u0435\u043D\u0430 \u043D\u0430 \u0437\u0430\u0432\u0442\u0440\u0430");
                return [3 /*break*/, 9];
            case 8:
                err_2 = _c.sent();
                bot.sendMessage(query.message.chat.id, "\u0427\u0442\u043E-\u0442\u043E \u043F\u043E\u0448\u043B\u043E \u043D\u0435 \u0442\u0430\u043A \u0441 \u0437\u0430\u044F\u0432\u043A\u043E\u0439 " + id);
                throw new Error(err_2);
            case 9: return [3 /*break*/, 10];
            case 10:
                bot.answerCallbackQuery({
                    callback_query_id: query.id
                });
                return [2 /*return*/];
        }
    });
}); });
bot.onText(/\/start/, function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var user, text;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, user_model_1.User.findOne({ chatId: msg.chat.id })];
            case 1:
                user = _a.sent();
                if (!!user) return [3 /*break*/, 3];
                return [4 /*yield*/, new user_model_1.User({ chatId: msg.chat.id, role: 'user', name: msg.from.first_name }).save()];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                text = 'Hello ' + msg.from.first_name + "\nВыберите дальнейшие действия: ";
                bot.sendMessage(helpers_1.getChatId(msg), text, {
                    reply_markup: {
                        keyboard: keyboard_1.mainKb.home
                    }
                });
                return [2 /*return*/];
        }
    });
}); });
bot.on('message', function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var chatId, user, _a, resp, headMessage, i, image, html, err_3, text, user_1, err_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                chatId = helpers_1.getChatId(msg);
                return [4 /*yield*/, user_model_1.User.findOne({ chatId: chatId })
                    // if (user.role !== 'user') {
                    //     switch(msg.text) {
                    //         case kb.home.getPayments:
                    //             bot.sendMessage(chatId, "Unauthorized")
                    //             break
                    //         case kb.home.close:
                    //             bot.sendMessage(chatId, 'closing', {
                    //                 reply_markup: {
                    //                     remove_keyboard: true
                    //                 }
                    //             })
                    //             break
                    //     }
                    // } else {
                ];
            case 1:
                user = _b.sent();
                _a = msg.text;
                switch (_a) {
                    case kb_1.kb.home.getPayments: return [3 /*break*/, 2];
                    case kb_1.kb.home.myPage: return [3 /*break*/, 6];
                    case kb_1.kb.loginPage.info: return [3 /*break*/, 7];
                    case kb_1.kb.loginPage.register: return [3 /*break*/, 8];
                    case kb_1.kb.loginPage.logout: return [3 /*break*/, 9];
                    case kb_1.kb.goBack: return [3 /*break*/, 13];
                    case kb_1.kb.home.close: return [3 /*break*/, 14];
                }
                return [3 /*break*/, 15];
            case 2:
                _b.trys.push([2, 4, , 5]);
                return [4 /*yield*/, axios_1.default.get(config_1.config.localApiUrl + "/payments/today", { headers: { Authorization: user.token } })];
            case 3:
                resp = _b.sent();
                headMessage = "\n<b>\u0421\u0435\u0433\u043E\u0434\u043D\u044F\u0448\u043D\u0438\u0435 \u0437\u0430\u044F\u0432\u043A\u0438</b>\n<b>\u0412\u0441\u0435\u0433\u043E \u0437\u0430\u044F\u0432\u043E\u043A \u043D\u0430 \u0441\u0435\u0433\u043E\u0434\u043D\u044F: " + resp.data.length + "\u0448\u0442</b>";
                bot.sendMessage(chatId, headMessage, {
                    parse_mode: 'HTML'
                });
                for (i = 0; i < resp.data.length; i++) {
                    image = void 0;
                    if (resp.data[i].image) {
                        image = './public/images/' + resp.data[i].image;
                    }
                    else {
                        image = './public/images/default.png';
                    }
                    html = "\n                                <strong>Hello, " + msg.from.first_name + "</strong>\n                    \n                                                    <i>\u0417\u0430\u044F\u0432\u043A\u0430 \u043D\u0430 \u0441\u0435\u0433\u043E\u0434\u043D\u044F:</i>\n                    \n<b>\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044F: </b>      <pre>" + resp.data[i].priority + "</pre>\n<b>\u0421\u0442\u0430\u0442\u0443\u0441: </b>         <pre>" + (resp.data[i].approved ? "Подтвержден" : resp.data[i].paided ? "Оплачен" : "Еще не подтверждена") + "</pre>\n<b>\u041D\u0430\u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435: </b>     <pre>" + resp.data[i].purpose + "</pre>\n<b>\u041F\u043B\u0430\u0442\u0435\u043B\u044C\u0449\u0438\u043A: </b>     <pre>" + resp.data[i].payer + "</pre>\n<b>\u041A\u043E\u043D\u0442\u0440\u0430\u043A\u0442\u043E\u0440: </b>     <pre>" + resp.data[i].contractor + "</pre>\n<b>\u0414\u0430\u0442\u0430 \u043F\u043B\u0430\u0442\u0435\u0436\u0430: </b>   <pre>" + resp.data[i].dateOfPayment + "</pre>\n<b>\u0421\u0443\u043C\u043C\u0430: </b>          <pre>" + resp.data[i].sum + " \u0442\u0433</pre>\n<b>id: </b>             <pre>" + resp.data[i]._id + "</pre>\n                            ";
                    bot.sendPhoto(chatId, image, {
                        caption: html,
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [
                                [{
                                        text: 'Подтвердить',
                                        callback_data: 'approve',
                                    },
                                    {
                                        text: "Перенести на завтра",
                                        callback_data: 'tomorrow'
                                    }]
                            ]
                        }
                    });
                }
                return [3 /*break*/, 5];
            case 4:
                err_3 = _b.sent();
                bot.sendMessage(chatId, "Ваши права не позволяют просматривать реестр на сегодня");
                return [3 /*break*/, 5];
            case 5: return [3 /*break*/, 15];
            case 6:
                bot.sendMessage(helpers_1.getChatId(msg), "Ваше учетное меню", {
                    reply_markup: {
                        keyboard: [
                            [{ text: kb_1.kb.loginPage.logout }],
                            [{ text: kb_1.kb.loginPage.register }],
                            [{ text: kb_1.kb.loginPage.info }],
                            [{ text: kb_1.kb.goBack }]
                        ]
                    }
                });
                return [3 /*break*/, 15];
            case 7:
                if (!user) {
                    bot.sendMessage(chatId, "Данных нет");
                }
                else {
                    text = "\n<b>" + user.name + "</b>\n<b>\u0423\u0440\u043E\u0432\u0435\u043D\u044C \u0434\u043E\u0441\u0442\u0443\u043F\u0430: " + user.role + "</b>\n                    ";
                    bot.sendMessage(chatId, text, {
                        parse_mode: 'HTML'
                    });
                }
                return [3 /*break*/, 15];
            case 8:
                try {
                    bot.sendMessage(chatId, "Для регистрации введите одной строкой /login_ затем ваш email, ставите пробел и пишите пароль, затем отправляете данное сообщение, ответ придет через несколько секунд.");
                }
                catch (err) {
                    bot.sendMessage(chatId, 'Ошибка при регистрации: ' + err);
                }
                return [3 /*break*/, 15];
            case 9:
                _b.trys.push([9, 11, , 12]);
                return [4 /*yield*/, user_model_1.User.findOne({ chatId: chatId })];
            case 10:
                user_1 = _b.sent();
                user_1.delete();
                bot.sendMessage(chatId, 'Вы разлогинились');
                return [3 /*break*/, 12];
            case 11:
                err_4 = _b.sent();
                bot.sendMessage(chatId, 'Ошибка при удалении учетной записи: ' + err_4);
                return [3 /*break*/, 12];
            case 12: return [3 /*break*/, 15];
            case 13:
                bot.sendMessage(chatId, 'Основное меню', {
                    reply_markup: {
                        keyboard: keyboard_1.mainKb.home
                    }
                });
                return [3 /*break*/, 15];
            case 14:
                bot.sendMessage(chatId, 'closing', {
                    reply_markup: {
                        remove_keyboard: true
                    }
                });
                return [3 /*break*/, 15];
            case 15: return [2 /*return*/];
        }
    });
}); });
// function registerSpecialUser(chatId: string) {
bot.onText(/\/login_(.+)/, function (msg, arr) { return __awaiter(void 0, void 0, void 0, function () {
    var userInputArray, userReadyToSendData, response, user, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // /login_mail@mail.com*123456
                // arr[0]=/login_
                // arr[1]=mail@mail.com*123456
                //     .replace(/\s+/g,' ').trim()
                console.log(arr[1]);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 7, , 8]);
                userInputArray = arr[1].split(" ");
                userReadyToSendData = {
                    workEmail: userInputArray[0],
                    password: userInputArray[1]
                };
                console.log(userReadyToSendData);
                console.log(config_1.config.localApiUrl + "/users/telegram_sessions");
                return [4 /*yield*/, axios_1.default.post(config_1.config.localApiUrl + "/users/telegram_sessions", userReadyToSendData)];
            case 2:
                response = _a.sent();
                return [4 /*yield*/, user_model_1.User.findOne({ chatId: msg.chat.id })];
            case 3:
                user = _a.sent();
                if (!user) return [3 /*break*/, 5];
                return [4 /*yield*/, user.delete()];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5: return [4 /*yield*/, new user_model_1.User({
                    chatId: msg.chat.id,
                    role: response.data.user.role,
                    name: msg.from.first_name,
                    token: response.data.user.token
                }).save()];
            case 6:
                _a.sent();
                bot.sendMessage(msg.chat.id, "Регистрация прошла успешно");
                return [3 /*break*/, 8];
            case 7:
                err_5 = _a.sent();
                bot.sendMessage(msg.chat.id, "Ошибка ввода");
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); });
// }
app.listen(config_1.config.telegramPort, function () {
    console.log('connected to port ' + config_1.config.telegramPort);
});
