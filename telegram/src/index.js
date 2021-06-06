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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helpers_1 = require("./app/helpers/helpers");
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const axios_1 = __importDefault(require("axios"));
const kb_1 = require("./app/helpers/kb");
const user_model_1 = require("./app/model/user-model");
const config_1 = require("./app/config");
const upload_1 = require("./app/upload");
const fs_1 = __importDefault(require("fs"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const keyboard_1 = require("./app/helpers/keyboard");
const moment_1 = __importDefault(require("moment"));
mongoose_1.default.connect(config_1.config.mongoUrl.url + config_1.config.mongoUrl.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
    console.log("Mongo connected");
})
    .catch(err => {
    console.log(err);
});
const app = express_1.default();
app.use(cors_1.default());
app.use(express_1.default.json());
const bot = new node_telegram_bot_api_1.default(config_1.config.telegramToken, {
    polling: {
        interval: 300,
        autoStart: true,
        params: {
            timeout: 10
        }
    }
});
// Прием новых только что созданных заявок. Даже если она никому не будет отправлена изображение все равно сохранится для будущих реестров и уведомлений смен статусов
app.post('/telegram', upload_1.upload.single('image'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.image) {
        try {
            const response = yield node_fetch_1.default(config_1.config.imagePathFromApi + "/uploads/" + req.body.image);
            const fileStream = fs_1.default.createWriteStream("./public/images/" + req.body.image);
            yield new Promise((resolve, reject) => {
                response.body.pipe(fileStream);
                response.body.on("error", reject);
                fileStream.on("finish", resolve);
            });
        }
        catch (e) {
            console.log('error' + e);
        }
    }
    const users = yield user_model_1.User.find({});
    try {
        for (let i = 0; i < users.length; i++) {
            let image = helpers_1.applyImage(req.body.image, fs_1.default);
            const html = helpers_1.createTextForMessage(req.body, `Hello, ${users[i].name}`, "Новая заявка", false);
            if (users[i].apiUserId === req.body.user || (users[i].role.includes('viewTodayPayments') && req.body.priority === 'Срочный')) {
                yield botSendsPhoto(users[i].chatId, image, html, req);
            }
        }
        res.send({ message: "File was successfully received" });
    }
    catch (err) {
        console.log(err);
        res.status(400).send({ error: "could not receive data" });
    }
}));
// Это функция для уведомления о предстоящем платеже создателя заявки
app.post('/telegram/:id/notification', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield statusChangingBody(req, res, `Срок оплаты платежа через ${req.body.noticePeriod} дня`);
}));
// Оповещение приглашенных пользователей о встрече
app.post('/telegram/calendarEvents', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        for (let i = 0; i < req.body.event.participants.length; i++) {
            const user = yield user_model_1.User.findOne({ apiUserId: req.body.event.participants[i].userId });
            if (!user)
                continue;
            const fileMessage = req.body.event.file !== "null" && "доступны в деталях встречи на сайте во вкладке График встреч" || "нет";
            const date = moment_1.default(req.body.event.date, "DDMMYYYY");
            const meetingMessage = `
                <b>${user.name}, вы приглашены на встречу: ${req.body.event.title}</b>
                \nДата: ${date.format("DD-MM-YYYY")}
                \nВремя: с ${req.body.event.from} - до ${req.body.event.to}
                \nМесто: ${req.body.event.room}
                \nСоздатель: ${req.body.creator.name} ${req.body.creator.surname}
                \nОписание: ${req.body.event.description}
                \nМатериалы: ${fileMessage} 
                \nid: ${req.body.event._id}
            `;
            yield bot.sendMessage(user.chatId, meetingMessage, {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: kb_1.kb.meeting.accept, callback_data: kb_1.kb.meeting.accept },
                            { text: kb_1.kb.meeting.reject, callback_data: kb_1.kb.meeting.reject }
                        ]
                    ]
                }
            });
        }
        res.send({ message: "Success" });
    }
    catch (error) {
        console.log(error); ////////
        res.status(500).send({ message: 'Telegram Error' });
    }
}));
// Оповещение участников об отмененной встрече
app.post('/telegram/delete/calendarEvents', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        for (let i = 0; i < req.body.participants.length; i++) {
            const user = yield user_model_1.User.findOne({ apiUserId: req.body.participants[i].userId });
            if (!user)
                continue;
            const date = moment_1.default(req.body.date, "DDMMYYYY");
            const meetingMessage = `
                <b>ВСТРЕЧА ОТМЕНЕНА</b>
                 \nДата: ${date.format("DD-MM-YYYY")}
                \nВремя: с ${req.body.from} - до ${req.body.to}
                \nМесто: ${req.body.room}
                \nОписание: ${req.body.description}
                \nid: ${req.body._id}
              
            `;
            yield bot.sendMessage(user.chatId, meetingMessage, {
                parse_mode: 'HTML',
            });
        }
        res.send({ message: "Success" });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Telegram Error' });
    }
}));
// Это функция для переноса заявок на следующий день
app.post('/telegram/:id/date', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield statusChangingBody(req, res, "Ваша заявка перенесена на завтра");
}));
// Это функция для подтверждения заявок
app.post('/telegram/:id/approved', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield statusChangingBody(req, res, "Ваша заявка подтверждена");
}));
// Это функция для уведомления об оплате заявки
app.post('/telegram/:id/paid', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield statusChangingBody(req, res, "Ваша заявка оплачена");
}));
// Здесь отрабатывают те кнопки, у которых в options задан callback_data
bot.on('callback_query', (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { chat, message_id } = query.message;
    let id = "";
    if (query.data === 'approve' || query.data === 'tomorrow') {
        const captionArray = query.message.caption.split("\n");
        const idLine = captionArray[captionArray.length - 1].replace(/\s+/g, ' ').trim();
        id = idLine.split(" ")[1];
    }
    if (query.data === kb_1.kb.meeting.accept || query.data === kb_1.kb.meeting.reject) {
        const captionArray = query.message.text.split("\n");
        const idLine = captionArray[captionArray.length - 1].replace(/\s+/g, ' ').trim();
        id = idLine.split(" ")[1];
    }
    try {
        const user = yield user_model_1.User.findOne({ chatId: query.message.chat.id });
        switch (query.data) {
            case 'delete':
                yield bot.deleteMessage(chat.id, message_id.toString());
                break;
            case 'approve':
                try {
                    yield axios_1.default.get(`${config_1.config.localApiUrl}/payments/telegram/${id}/approved`, { headers: { Authorization: user.token } });
                    yield bot.sendMessage(query.message.chat.id, `Заявка ${id} подтверждена`);
                    yield bot.deleteMessage(query.message.chat.id, query.message.message_id.toString());
                }
                catch (err) {
                    yield bot.sendMessage(query.message.chat.id, `Что-то пошло не так с заявкой ${id}, либо у вас нет прав на данное действие`);
                    throw new Error(err);
                }
                break;
            case 'tomorrow':
                try {
                    yield axios_1.default.get(`${config_1.config.localApiUrl}/payments/telegram/${id}/date`, { headers: { Authorization: user.token } });
                    yield bot.sendMessage(query.message.chat.id, `Заявка ${id} перенесена на завтра`);
                    yield bot.deleteMessage(query.message.chat.id, query.message.message_id.toString());
                }
                catch (err) {
                    yield bot.sendMessage(query.message.chat.id, `Что-то пошло не так с заявкой ${id}, либо у вас нет прав на данное действие`);
                    throw new Error(err);
                }
                break;
            case kb_1.kb.meeting.accept:
                try {
                    yield axios_1.default.get(`${config_1.config.localApiUrl}/calendarEvents/${id}/accept`, { headers: { Authorization: user.token } });
                    yield bot.sendMessage(query.message.chat.id, `Встреча ${id} принята`);
                    yield bot.deleteMessage(query.message.chat.id, query.message.message_id.toString());
                }
                catch (err) {
                    yield bot.sendMessage(query.message.chat.id, `Что-то пошло не так с принятием встречи ${id}, либо у вас нет прав на данное действие`);
                    throw new Error(err);
                }
                break;
            case kb_1.kb.meeting.reject:
                try {
                    yield axios_1.default.get(`${config_1.config.localApiUrl}/calendarEvents/${id}/reject`, { headers: { Authorization: user.token } });
                    yield bot.sendMessage(query.message.chat.id, `Встреча ${id} отклонена`);
                    yield bot.deleteMessage(query.message.chat.id, query.message.message_id.toString());
                }
                catch (err) {
                    yield bot.sendMessage(query.message.chat.id, `Что-то пошло не так с отклонением встречи ${id}, либо у вас нет прав на данное действие`);
                    throw new Error(err);
                }
                break;
        }
    }
    catch (err) {
        console.log("ERROR ", err);
    }
}));
// Стандартная команда для начала работы, открывает главное меню
bot.onText(/\/start/, (msg) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ chatId: msg.chat.id });
    const text = 'Hello ' + msg.from.first_name + "\nВыберите дальнейшие действия: ";
    if (user) {
        const keyB = helpers_1.getKeyBoard(user);
        yield bot.sendMessage(helpers_1.getChatId(msg), text, {
            reply_markup: {
                keyboard: keyB
            }
        });
    }
    else {
        yield bot.sendMessage(helpers_1.getChatId(msg), text, {
            reply_markup: {
                keyboard: keyboard_1.mainKb.homeUser
            }
        });
    }
}));
// !!!Это основная функция, здесь происходит много всякого, отлов команд, получение реестра, кнопки всякие активируются!!!
bot.on('message', (msg) => __awaiter(void 0, void 0, void 0, function* () {
    const chatId = helpers_1.getChatId(msg);
    const user = yield user_model_1.User.findOne({ chatId: chatId });
    let keyB;
    if (user) {
        keyB = helpers_1.getKeyBoard(user);
    }
    else {
        keyB = keyboard_1.mainKb.homeUser;
    }
    switch (msg.text) {
        case kb_1.kb.home.getPayments:
            try {
                const resp = yield axios_1.default.get(`${config_1.config.localApiUrl}/payments/due/today/telegram`, { headers: { Authorization: user.token } });
                const headMessage = `
<b>Сегодняшние заявки</b>
<b>Всего заявок на сегодня: ${resp.data.length}шт</b>`;
                yield bot.sendMessage(chatId, headMessage, {
                    parse_mode: 'HTML'
                });
                for (let i = 0; i < resp.data.length; i++) {
                    if (resp.data.approved)
                        continue;
                    let image = helpers_1.applyImage(resp.data[i].image, fs_1.default);
                    const numeration = `
<pre>  </pre>
            -------<b>${i + 1}</b>-------

`;
                    yield bot.sendMessage(chatId, numeration, { parse_mode: 'HTML' });
                    const html = helpers_1.createTextForMessage(resp.data[i], `Hello, ${msg.from.first_name}`, "Заявка на сегодня: ", true);
                    yield bot.sendPhoto(chatId, image, {
                        caption: html,
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [
                                [{
                                        text: 'Детали заявки',
                                        url: `${config_1.config.serverAdress}/payments/${resp.data[i]._id}`
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
                    });
                }
            }
            catch (err) {
                yield bot.sendMessage(chatId, "Ваши права не позволяют просматривать реестр на сегодня");
            }
            break;
        case kb_1.kb.home.getToBePaid:
            try {
                const resp = yield axios_1.default.get(`${config_1.config.localApiUrl}/payments/due/to-be-paid`, { headers: { Authorization: user.token } });
                const headMessage = `
<b>Заявки к оплате</b>
<b>Всего заявок на оплату: ${resp.data.length}шт</b>`;
                yield bot.sendMessage(chatId, headMessage, {
                    parse_mode: 'HTML'
                });
                for (let i = 0; i < resp.data.length; i++) {
                    if (resp.data.approved)
                        continue;
                    let image = helpers_1.applyImage(resp.data[i].image, fs_1.default);
                    const numeration = `
<pre>  </pre>
            -------<b>${i + 1}</b>-------

`;
                    yield bot.sendMessage(chatId, numeration, { parse_mode: 'HTML' });
                    const html = helpers_1.createTextForMessage(resp.data[i], `Hello, ${msg.from.first_name}`, "Заявка на оплату: ", true);
                    yield bot.sendPhoto(chatId, image, {
                        caption: html,
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [
                                [{
                                        text: 'Детали заявки',
                                        url: `${config_1.config.serverAdress}/payments/${resp.data[i]._id}`
                                    }]
                            ]
                        }
                    });
                }
            }
            catch (err) {
                yield bot.sendMessage(chatId, "Ваши права не позволяют просматривать заявки на оплату");
            }
            break;
        case kb_1.kb.home.seeEvents:
            try {
                const resp = yield axios_1.default.get(`${config_1.config.localApiUrl}/calendarEvents/${user.apiUserId}/myEvents`, { headers: { Authorization: user.token } });
                const headMessage = `
<b>Ваши предстоящие встечи ${user.name}</b>
<b>Всего встреч: ${resp.data.length}шт</b>`;
                yield bot.sendMessage(chatId, headMessage, {
                    parse_mode: 'HTML'
                });
                for (let i = 0; i < resp.data.length; i++) {
                    const participant = resp.data[i].participants.filter(p => p.userId === user.apiUserId);
                    console.log(participant[0]);
                    const numeration = `
<pre>  </pre>
            -------<b>${i + 1}</b>-------

`;
                    const fileMessage = resp.data[i].file !== "null" && "доступны в деталях встречи на сайте во вкладке График встреч" || "нет";
                    const date = moment_1.default(resp.data[i].date, "DDMMYYYY");
                    const meetingMessage = `
                <b>${user.name}, вы приглашены на встречу: ${resp.data[i].title}</b>
                \nДата: ${date.format("DD-MM-YYYY")}
                \nВремя: с ${resp.data[i].from} - до ${resp.data[i].to}
                \nМесто: ${resp.data[i].room}
                \nСоздатель: ${resp.data[i].user.name} ${resp.data[i].user.surname}
                \nОписание: ${resp.data[i].description}
                \nМатериалы: ${fileMessage} 
                <pre>--------------------------</pre>
<b>Статус: ${participant[0].accepted === null ? "Решение еще не принято" : participant[0].accepted ? "Вы подтвердили эту встречу" : "Вы отклонили эту встречу"}</b>
                <pre>--------------------------</pre>
                \nid: ${resp.data[i]._id}
            `;
                    yield bot.sendMessage(user.chatId, numeration, {
                        parse_mode: 'HTML'
                    });
                    if (participant[0].accepted === null) {
                        yield bot.sendMessage(user.chatId, meetingMessage, {
                            parse_mode: 'HTML',
                            reply_markup: {
                                inline_keyboard: [
                                    [
                                        { text: kb_1.kb.meeting.accept, callback_data: kb_1.kb.meeting.accept },
                                        { text: kb_1.kb.meeting.reject, callback_data: kb_1.kb.meeting.reject }
                                    ]
                                ]
                            }
                        });
                    }
                    else {
                        yield bot.sendMessage(user.chatId, meetingMessage, {
                            parse_mode: 'HTML',
                        });
                    }
                }
            }
            catch (err) {
                yield bot.sendMessage(chatId, "Ваши права не позволяют просматривать предстоящие встречи");
            }
            break;
        case kb_1.kb.home.myPage:
            let opts = {
                reply_markup: {
                    keyboard: [
                        [{ text: kb_1.kb.loginPage.info }],
                        [{ text: kb_1.kb.goBack }]
                    ]
                }
            };
            if (user) {
                opts.reply_markup.keyboard.unshift([{ text: kb_1.kb.loginPage.logout }]);
            }
            else {
                opts.reply_markup.keyboard.unshift([{ text: kb_1.kb.loginPage.login }]);
            }
            ;
            yield bot.sendMessage(helpers_1.getChatId(msg), "Ваше учетное меню", opts);
            break;
        case kb_1.kb.loginPage.info:
            if (!user) {
                yield bot.sendMessage(chatId, "Данных нет");
            }
            else {
                const text = `
<b>${user.name}</b>
<b>Уровень доступа: ${user.role}</b>
                    `;
                yield bot.sendMessage(chatId, text, {
                    parse_mode: 'HTML'
                });
            }
            break;
        case kb_1.kb.loginPage.login:
            try {
                yield bot.sendMessage(chatId, "Для входа введите одной строкой /login_ затем ваш email, ставите пробел и пишите пароль (тот что вы создали при регистрации на десктопной версии), затем отправляете данное сообщение, ответ придет через несколько секунд.");
            }
            catch (err) {
                yield bot.sendMessage(chatId, 'Ошибка при регистрации: ' + err);
            }
            break;
        case kb_1.kb.loginPage.logout:
            try {
                const user = yield user_model_1.User.findOne({ chatId: chatId });
                user.delete();
                yield bot.sendMessage(chatId, 'Вы разлогинились');
            }
            catch (err) {
                yield bot.sendMessage(chatId, 'Ошибка при выходе из учетной записи: ' + err);
            }
            break;
        case kb_1.kb.goBack:
            yield bot.sendMessage(chatId, 'Основное меню', {
                reply_markup: {
                    keyboard: keyB
                }
            });
            break;
        case kb_1.kb.home.close:
            yield bot.sendMessage(chatId, 'Закрыть меню', {
                reply_markup: {
                    remove_keyboard: true
                }
            });
            break;
    }
}));
// Функция регистрации, через регулярку получаем все что после /login_ и отправляем запрос на апи для аутентификации, пользователь и его данные сохраняются здесь локально
bot.onText(/\/login_(.+)/, (msg, arr) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userInputArray = arr[1].replace(/\s+/g, ' ').trim().split(" ");
        const userReadyToSendData = {
            workEmail: userInputArray[0],
            password: userInputArray[1]
        };
        const response = yield axios_1.default.post(config_1.config.localApiUrl + "/users/telegram_sessions", userReadyToSendData);
        const user = yield user_model_1.User.findOne({ chatId: msg.chat.id });
        if (user) {
            yield user.delete();
        }
        yield new user_model_1.User({
            chatId: msg.chat.id,
            role: response.data.user.role,
            name: msg.from.first_name,
            token: response.data.user.token[1],
            apiUserId: response.data.user._id
        }).save();
        yield bot.sendMessage(msg.chat.id, "Регистрация прошла успешно");
        yield bot.sendMessage(msg.chat.id, 'Меню закрывается для обновления, введите /start чтобы вновь открыть основное меню, если не было сообщений об ошибке, то сообщение с вашим e-mail и паролем будет удаленно автоматически через 10 секунд', {
            reply_markup: {
                remove_keyboard: true
            }
        });
        setTimeout(() => {
            bot.deleteMessage(msg.chat.id, msg.message_id.toString());
        }, 10000);
    }
    catch (err) {
        yield bot.sendMessage(msg.chat.id, "Ошибка ввода");
    }
}));
// Создание ответного сообщения при смене статуса, находит инициатора и уведомляет его (или ее)
function statusChangingBody(req, res, text) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.params.id;
        const user = yield user_model_1.User.findOne({ apiUserId: userId });
        let image = helpers_1.applyImage(req.body.image, fs_1.default);
        if (user) {
            const html = helpers_1.createTextForMessage(req.body, `${user.name}, ${text}`, "Данные по заявке: ", false);
            yield botSendsPhoto(user.chatId, image, html, req);
            res.send({ message: "Все круто" });
        }
        else
            res.status(404).send({ message: "user not found" });
    });
}
// Бот формирует стандартное сообщение
function botSendsPhoto(chatId, image, html, req) {
    return __awaiter(this, void 0, void 0, function* () {
        yield bot.sendPhoto(chatId, image, {
            caption: html,
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [{
                            text: 'Детали заявки',
                            url: `${config_1.config.serverAdress}/payments/${req.body._id}`
                        }],
                    [{
                            text: "Удалить из сообщений",
                            callback_data: 'delete'
                        }]
                ]
            }
        });
    });
}
app.listen(config_1.config.telegramPort, () => {
    console.log('connected to port ' + config_1.config.telegramPort);
});
