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
var fs_1 = __importDefault(require("fs"));
var node_fetch_1 = __importDefault(require("node-fetch"));
mongoose_1.default.connect(config_1.config.mongoUrl.url + config_1.config.mongoUrl.db, {
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
// Прием новых только что созданных заявок. Даже если она никому не будет отправлена изображение все равно сохранится для будущих реестров и уведомлений смен статусов
app.post('/telegram', upload_1.upload.single('image'), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var response_1, fileStream_1, e_1, users, i, image, html, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.body.image) return [3 /*break*/, 5];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, node_fetch_1.default("http://" + process.env.BACKEND_HOST + ":8000/uploads/" + req.body.image)];
            case 2:
                response_1 = _a.sent();
                fileStream_1 = fs_1.default.createWriteStream("./public/images/" + req.body.image);
                return [4 /*yield*/, new Promise(function (resolve, reject) {
                        response_1.body.pipe(fileStream_1);
                        response_1.body.on("error", reject);
                        fileStream_1.on("finish", resolve);
                    })];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                e_1 = _a.sent();
                console.log('error' + e_1);
                return [3 /*break*/, 5];
            case 5: return [4 /*yield*/, user_model_1.User.find({})];
            case 6:
                users = _a.sent();
                _a.label = 7;
            case 7:
                _a.trys.push([7, 12, , 13]);
                i = 0;
                _a.label = 8;
            case 8:
                if (!(i < users.length)) return [3 /*break*/, 11];
                image = helpers_1.applyImage(req.body.image, fs_1.default);
                html = helpers_1.createTextForMessage(req.body, "Hello, " + users[i].name, "Новая заявка", false);
                if (!(users[i].apiUserId === req.body.user || (users[i].role === 'director' && req.body.priority === 'Срочный'))) return [3 /*break*/, 10];
                return [4 /*yield*/, botSendsPhoto(users[i].chatId, image, html)];
            case 9:
                _a.sent();
                _a.label = 10;
            case 10:
                i++;
                return [3 /*break*/, 8];
            case 11:
                res.send({ message: "File was successfully received" });
                return [3 /*break*/, 13];
            case 12:
                err_1 = _a.sent();
                console.log(err_1);
                res.status(400).send({ error: "could not receive data" });
                return [3 /*break*/, 13];
            case 13: return [2 /*return*/];
        }
    });
}); });
// Это функция для переноса заявок на следующий день
app.post('/telegram/:id/date', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, dateAndApproveChangingBody(req, res, "Ваша заявка перенесена на завтра")];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
// Это функция для подтверждения заявок
app.post('/telegram/:id/approved', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, dateAndApproveChangingBody(req, res, "Ваша заявка подтверждена")];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
// Здесь отрабатывают те кнопки, у которых в options задан callback_data
bot.on('callback_query', function (query) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, chat, message_id, id, captionArray, idLine, _b, err_2, err_3;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = query.message, chat = _a.chat, message_id = _a.message_id;
                id = "";
                if (query.data === 'approve' || query.data === 'tomorrow') {
                    captionArray = query.message.caption.split("\n");
                    idLine = captionArray[captionArray.length - 1].replace(/\s+/g, ' ').trim();
                    id = idLine.split(" ")[1];
                }
                _b = query.data;
                switch (_b) {
                    case 'delete': return [3 /*break*/, 1];
                    case 'approve': return [3 /*break*/, 3];
                    case 'tomorrow': return [3 /*break*/, 9];
                }
                return [3 /*break*/, 15];
            case 1: return [4 /*yield*/, bot.deleteMessage(chat.id, message_id.toString())];
            case 2:
                _c.sent();
                return [3 /*break*/, 15];
            case 3:
                _c.trys.push([3, 6, , 8]);
                return [4 /*yield*/, axios_1.default.post(config_1.config.localApiUrl + "/payments/telegram/" + id + "/approved")];
            case 4:
                _c.sent();
                return [4 /*yield*/, bot.sendMessage(query.message.chat.id, "\u0417\u0430\u044F\u0432\u043A\u0430 " + id + " \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0430")];
            case 5:
                _c.sent();
                return [3 /*break*/, 8];
            case 6:
                err_2 = _c.sent();
                return [4 /*yield*/, bot.sendMessage(query.message.chat.id, "\u0427\u0442\u043E-\u0442\u043E \u043F\u043E\u0448\u043B\u043E \u043D\u0435 \u0442\u0430\u043A \u0441 \u0437\u0430\u044F\u0432\u043A\u043E\u0439 " + id)];
            case 7:
                _c.sent();
                throw new Error(err_2);
            case 8: return [3 /*break*/, 15];
            case 9:
                _c.trys.push([9, 12, , 14]);
                return [4 /*yield*/, axios_1.default.post(config_1.config.localApiUrl + "/payments/telegram/" + id + "/date")];
            case 10:
                _c.sent();
                return [4 /*yield*/, bot.sendMessage(query.message.chat.id, "\u0417\u0430\u044F\u0432\u043A\u0430 " + id + " \u043F\u0435\u0440\u0435\u043D\u0435\u0441\u0435\u043D\u0430 \u043D\u0430 \u0437\u0430\u0432\u0442\u0440\u0430")];
            case 11:
                _c.sent();
                return [3 /*break*/, 14];
            case 12:
                err_3 = _c.sent();
                return [4 /*yield*/, bot.sendMessage(query.message.chat.id, "\u0427\u0442\u043E-\u0442\u043E \u043F\u043E\u0448\u043B\u043E \u043D\u0435 \u0442\u0430\u043A \u0441 \u0437\u0430\u044F\u0432\u043A\u043E\u0439 " + id)];
            case 13:
                _c.sent();
                throw new Error(err_3);
            case 14: return [3 /*break*/, 15];
            case 15: return [2 /*return*/];
        }
    });
}); });
// Стандартная команда для начала работы, открывает главное меню
bot.onText(/\/start/, function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var text;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                text = 'Hello ' + msg.from.first_name + "\nВыберите дальнейшие действия: ";
                return [4 /*yield*/, bot.sendMessage(helpers_1.getChatId(msg), text, {
                        reply_markup: {
                            keyboard: keyboard_1.mainKb.home
                        }
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
// Это основная функция, здесь происходит много всякого, отлов команд, получение реестра, кнопки всякие активируются
bot.on('message', function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var chatId, user, _a, resp, headMessage, i, image, numeration, html, err_4, text, err_5, user_1, err_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                chatId = helpers_1.getChatId(msg);
                return [4 /*yield*/, user_model_1.User.findOne({ chatId: chatId })];
            case 1:
                user = _b.sent();
                _a = msg.text;
                switch (_a) {
                    case kb_1.kb.home.getPayments: return [3 /*break*/, 2];
                    case kb_1.kb.home.myPage: return [3 /*break*/, 13];
                    case kb_1.kb.loginPage.info: return [3 /*break*/, 15];
                    case kb_1.kb.loginPage.register: return [3 /*break*/, 20];
                    case kb_1.kb.loginPage.logout: return [3 /*break*/, 25];
                    case kb_1.kb.goBack: return [3 /*break*/, 31];
                    case kb_1.kb.home.close: return [3 /*break*/, 33];
                }
                return [3 /*break*/, 35];
            case 2:
                _b.trys.push([2, 10, , 12]);
                return [4 /*yield*/, axios_1.default.get(config_1.config.localApiUrl + "/payments/due/today", { headers: { Authorization: user.token } })];
            case 3:
                resp = _b.sent();
                headMessage = "\n<b>\u0421\u0435\u0433\u043E\u0434\u043D\u044F\u0448\u043D\u0438\u0435 \u0437\u0430\u044F\u0432\u043A\u0438</b>\n<b>\u0412\u0441\u0435\u0433\u043E \u0437\u0430\u044F\u0432\u043E\u043A \u043D\u0430 \u0441\u0435\u0433\u043E\u0434\u043D\u044F: " + resp.data.length + "\u0448\u0442</b>";
                return [4 /*yield*/, bot.sendMessage(chatId, headMessage, {
                        parse_mode: 'HTML'
                    })];
            case 4:
                _b.sent();
                i = 0;
                _b.label = 5;
            case 5:
                if (!(i < resp.data.length)) return [3 /*break*/, 9];
                image = helpers_1.applyImage(resp.data[i].image, fs_1.default);
                numeration = "\n<pre>  </pre>\n            -------<b>" + (i + 1) + "</b>-------\n\n";
                return [4 /*yield*/, bot.sendMessage(chatId, numeration, { parse_mode: 'HTML' })];
            case 6:
                _b.sent();
                html = helpers_1.createTextForMessage(resp.data[i], "Hello, " + msg.from.first_name, "Заявка на сегодня: ", true);
                return [4 /*yield*/, bot.sendPhoto(chatId, image, {
                        caption: html,
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [
                                [{
                                        text: 'Детали заявки',
                                        url: 'https://google.com'
                                    }],
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
                    })];
            case 7:
                _b.sent();
                _b.label = 8;
            case 8:
                i++;
                return [3 /*break*/, 5];
            case 9: return [3 /*break*/, 12];
            case 10:
                err_4 = _b.sent();
                return [4 /*yield*/, bot.sendMessage(chatId, "Ваши права не позволяют просматривать реестр на сегодня")];
            case 11:
                _b.sent();
                return [3 /*break*/, 12];
            case 12: return [3 /*break*/, 35];
            case 13: return [4 /*yield*/, bot.sendMessage(helpers_1.getChatId(msg), "Ваше учетное меню", {
                    reply_markup: {
                        keyboard: [
                            [{ text: kb_1.kb.loginPage.logout }],
                            [{ text: kb_1.kb.loginPage.register }],
                            [{ text: kb_1.kb.loginPage.info }],
                            [{ text: kb_1.kb.goBack }]
                        ]
                    }
                })];
            case 14:
                _b.sent();
                return [3 /*break*/, 35];
            case 15:
                if (!!user) return [3 /*break*/, 17];
                return [4 /*yield*/, bot.sendMessage(chatId, "Данных нет")];
            case 16:
                _b.sent();
                return [3 /*break*/, 19];
            case 17:
                text = "\n<b>" + user.name + "</b>\n<b>\u0423\u0440\u043E\u0432\u0435\u043D\u044C \u0434\u043E\u0441\u0442\u0443\u043F\u0430: " + user.role + "</b>\n                    ";
                return [4 /*yield*/, bot.sendMessage(chatId, text, {
                        parse_mode: 'HTML'
                    })];
            case 18:
                _b.sent();
                _b.label = 19;
            case 19: return [3 /*break*/, 35];
            case 20:
                _b.trys.push([20, 22, , 24]);
                return [4 /*yield*/, bot.sendMessage(chatId, "Для регистрации введите одной строкой /login_ затем ваш email, ставите пробел и пишите пароль, затем отправляете данное сообщение, ответ придет через несколько секунд.")];
            case 21:
                _b.sent();
                return [3 /*break*/, 24];
            case 22:
                err_5 = _b.sent();
                return [4 /*yield*/, bot.sendMessage(chatId, 'Ошибка при регистрации: ' + err_5)];
            case 23:
                _b.sent();
                return [3 /*break*/, 24];
            case 24: return [3 /*break*/, 35];
            case 25:
                _b.trys.push([25, 28, , 30]);
                return [4 /*yield*/, user_model_1.User.findOne({ chatId: chatId })];
            case 26:
                user_1 = _b.sent();
                user_1.delete();
                return [4 /*yield*/, bot.sendMessage(chatId, 'Вы разлогинились')];
            case 27:
                _b.sent();
                return [3 /*break*/, 30];
            case 28:
                err_6 = _b.sent();
                return [4 /*yield*/, bot.sendMessage(chatId, 'Ошибка при удалении учетной записи: ' + err_6)];
            case 29:
                _b.sent();
                return [3 /*break*/, 30];
            case 30: return [3 /*break*/, 35];
            case 31: return [4 /*yield*/, bot.sendMessage(chatId, 'Основное меню', {
                    reply_markup: {
                        keyboard: keyboard_1.mainKb.home
                    }
                })];
            case 32:
                _b.sent();
                return [3 /*break*/, 35];
            case 33: return [4 /*yield*/, bot.sendMessage(chatId, 'Закрыть меню', {
                    reply_markup: {
                        remove_keyboard: true
                    }
                })];
            case 34:
                _b.sent();
                return [3 /*break*/, 35];
            case 35: return [2 /*return*/];
        }
    });
}); });
// Функция регистрации, через регулярку получаем все что после /login_ и отправляем запрос на апи для аутентификации, пользователь и его данные сохраняются здесь локально
bot.onText(/\/login_(.+)/, function (msg, arr) { return __awaiter(void 0, void 0, void 0, function () {
    var userInputArray, userReadyToSendData, response, user, err_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 9]);
                userInputArray = arr[1].replace(/\s+/g, ' ').trim().split(" ");
                userReadyToSendData = {
                    workEmail: userInputArray[0],
                    password: userInputArray[1]
                };
                return [4 /*yield*/, axios_1.default.post(config_1.config.localApiUrl + "/users/telegram_sessions", userReadyToSendData)];
            case 1:
                response = _a.sent();
                return [4 /*yield*/, user_model_1.User.findOne({ chatId: msg.chat.id })];
            case 2:
                user = _a.sent();
                if (!user) return [3 /*break*/, 4];
                return [4 /*yield*/, user.delete()];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4: return [4 /*yield*/, new user_model_1.User({
                    chatId: msg.chat.id,
                    role: response.data.user.role,
                    name: msg.from.first_name,
                    token: response.data.user.token,
                    apiUserId: response.data.user._id
                }).save()];
            case 5:
                _a.sent();
                return [4 /*yield*/, bot.sendMessage(msg.chat.id, "Регистрация прошла успешно")];
            case 6:
                _a.sent();
                return [3 /*break*/, 9];
            case 7:
                err_7 = _a.sent();
                return [4 /*yield*/, bot.sendMessage(msg.chat.id, "Ошибка ввода")];
            case 8:
                _a.sent();
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); });
// Создание ответного сообщения при смене статуса, находит инициатора и уведомляет его (или ее)
function dateAndApproveChangingBody(req, res, text) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, user, image, html;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userId = req.params.id;
                    return [4 /*yield*/, user_model_1.User.findOne({ apiUserId: userId })];
                case 1:
                    user = _a.sent();
                    if (!user)
                        res.status(404).send({ message: "user not found" });
                    image = helpers_1.applyImage(req.body.image, fs_1.default);
                    html = helpers_1.createTextForMessage(req.body, user.name + ", " + text, "Данные по заявке: ", false);
                    return [4 /*yield*/, botSendsPhoto(user.chatId, image, html)];
                case 2:
                    _a.sent();
                    res.send({ message: "Все круто" });
                    return [2 /*return*/];
            }
        });
    });
}
// Бот формирует стандартное сообщение
function botSendsPhoto(chatId, image, html) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, bot.sendPhoto(chatId, image, {
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
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
app.listen(config_1.config.telegramPort, function () {
    console.log('connected to port ' + config_1.config.telegramPort);
});
