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
// import {InlineQueryObject} from "./classes/inlineQueryObject";
var mongoose_1 = __importDefault(require("mongoose"));
var axios_1 = __importDefault(require("axios"));
var keyboard_1 = require("./app/helpers/keyboard");
var kb_1 = require("./app/helpers/kb");
// import {Film} from "./model/film-model";
// import {Cinema} from "./model/cinema-model";
// import { FilmClass } from './classes/FilmClass';
var user_model_1 = require("./app/model/user-model");
mongoose_1.default.connect('mongodb+srv://QWE123:QWE123@cluster0.rrd3k.mongodb.net/telega3\n', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(function () {
    console.log("Mongo connected");
})
    .catch(function (err) {
    console.log(err);
});
// const FilmClass = mongoose.model('films')
// const ACTION_TYPE = {
//     TOGGLE_FAV_FILM: 'tff',
//     SHOW_CINEMAS: 'sc',
//     SHOW_CINEMAS_MAP: 'scm',
//     SHOW_FILMS: 'sf'
// }
// console.log(FilmClass.find())
var app = express_1.default();
app.use(cors_1.default());
app.use(express_1.default.json());
var TOKEN = '1688455909:AAG6JNSW5JfBA8Z5JrkS22EbnbJPuZk1SpI';
var bot = new node_telegram_bot_api_1.default(TOKEN, {
    polling: {
        interval: 300,
        autoStart: true,
        params: {
            timeout: 10
        }
    }
});
app.post('/telegram', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var users, i, image, html;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, user_model_1.User.find({})];
            case 1:
                users = _a.sent();
                try {
                    for (i = 0; i < users.length; i++) {
                        image = void 0;
                        if (req.body.image && req.body.image === 'somestuff') {
                            image = "http://localhost:8000/uploads/" + req.body.image;
                        }
                        else {
                            image = './public/images/default.png';
                        }
                        html = "\n                                <strong>Hello, " + users[i].name + "</strong>\n                    \n                                                    <i>\u041D\u043E\u0432\u0430\u044F \u0437\u0430\u044F\u0432\u043A\u0430:</i>\n                    \n<b>\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044F: </b>      <pre>" + req.body.priority + "</pre>\n<b>\u0421\u0442\u0430\u0442\u0443\u0441: </b>         <pre>" + (req.body.approved ? "Подтвержден" : req.body.paided ? "Оплачен" : "Еще не подтверждена") + "</pre>\n<b>\u041D\u0430\u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435: </b>     <pre>" + req.body.purpose + "</pre>\n<b>\u041F\u043B\u0430\u0442\u0435\u043B\u044C\u0449\u0438\u043A: </b>     <pre>" + req.body.payer + "</pre>\n<b>\u041A\u043E\u043D\u0442\u0440\u0430\u043A\u0442\u043E\u0440: </b>     <pre>" + req.body.contractor + "</pre>\n<b>\u0414\u0430\u0442\u0430 \u043F\u043B\u0430\u0442\u0435\u0436\u0430: </b>   <pre>" + req.body.dateOfPayment + "</pre>\n<b>\u0421\u0443\u043C\u043C\u0430: </b>          <pre>" + req.body.sum + " \u0442\u0433</pre>\n                            ";
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
                return [4 /*yield*/, axios_1.default.post("http://localhost:8000/payments/telegram/" + id + "/approved")];
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
                return [4 /*yield*/, axios_1.default.post("http://localhost:8000/payments/telegram/" + id + "/date")];
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
                text = 'Hello' + msg.from.first_name + "\nChoose option to continue: ";
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
    var chatId, user, _a, resp, headMessage, i, image, html;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                chatId = helpers_1.getChatId(msg);
                return [4 /*yield*/, user_model_1.User.findOne({ chatId: chatId })];
            case 1:
                user = _b.sent();
                if (!(user.role !== 'user')) return [3 /*break*/, 2];
                switch (msg.text) {
                    case kb_1.kb.home.getPayments:
                        bot.sendMessage(chatId, "Unauthorized");
                        break;
                    case kb_1.kb.home.close:
                        bot.sendMessage(chatId, 'closing', {
                            reply_markup: {
                                remove_keyboard: true
                            }
                        });
                }
                return [3 /*break*/, 6];
            case 2:
                _a = msg.text;
                switch (_a) {
                    case kb_1.kb.home.getPayments: return [3 /*break*/, 3];
                    case kb_1.kb.home.close: return [3 /*break*/, 5];
                }
                return [3 /*break*/, 6];
            case 3: return [4 /*yield*/, axios_1.default.get('http://localhost:8000/payments/today', { headers: { Authorization: "ukACJRbddCiW4J--qk9Xu" } })];
            case 4:
                resp = _b.sent();
                headMessage = "\n<b>\u0421\u0435\u0433\u043E\u0434\u043D\u044F\u0448\u043D\u0438\u0435 \u0437\u0430\u044F\u0432\u043A\u0438</b>\n<b>\u0412\u0441\u0435\u0433\u043E \u0437\u0430\u044F\u0432\u043E\u043A \u043D\u0430 \u0441\u0435\u0433\u043E\u0434\u043D\u044F: " + resp.data.length + "\u0448\u0442</b>";
                bot.sendMessage(chatId, headMessage, {
                    parse_mode: 'HTML'
                });
                for (i = 0; i < resp.data.length; i++) {
                    image = void 0;
                    if (resp.data[i].image && resp.data[i].image === 'somestuff') {
                        image = "http://localhost:8000/uploads/" + resp.data[i].image;
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
                return [3 /*break*/, 6];
            case 5:
                bot.sendMessage(chatId, 'closing', {
                    reply_markup: {
                        remove_keyboard: true
                    }
                });
                _b.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); });
// bot.on('message', msg => {
//     console.log('Working')
//     const chatId = getChatId(msg)
//     switch(msg.text) {
//         case kb.home.favorite:
//             showFavoriteFilms(chatId, msg.from!.id)
//             break
//         case kb.home.films:
//             bot.sendMessage(chatId, 'choose type', {
//                 reply_markup: {
//                     keyboard: mainKb.films
//                 }
//             })
//             break
//         case kb.film.comedy:
//             sendFilmsByQuery(chatId, {type: 'comedy'})
//             break
//         case kb.film.action:
//             sendFilmsByQuery(chatId, {type: 'action'})
//             break
//         case kb.film.random:
//             sendFilmsByQuery(chatId, {})
//             break
//         case kb.home.cinemas:
//             bot.sendMessage(chatId, `Send location`, {
//                 reply_markup: {
//                     keyboard: mainKb.cinemas
//                 }
//             })
//             break
//         case kb.back:
//             bot.sendMessage(chatId, 'Go back', {
//                 reply_markup: {
//                     keyboard: mainKb.home
//                 }
//             })
//     }
//     if (msg.location) {
//         console.log(msg.location)
//         getCinemasiInCoord(chatId, msg.location)
//     }
// })
//
// bot.on('callback_query', (query: any) => {
//     const userId = query.from!.id
//     let data
//
//     try {
//         data = JSON.parse(query.data)
//     } catch(err) {
//         throw new Error("Data is not an object")
//     }
//     const { type } = data
//
//     if (type === ACTION_TYPE.SHOW_CINEMAS_MAP) {
//         const {lat, lon} = data
//         bot.sendLocation(query.message.chat.id, lat, lon)
//     } else if (type === ACTION_TYPE.SHOW_CINEMAS) {
//         sendCinemasByQuery(userId, {uuid: {'$in': data.cinemaUuids}})
//     } else if (type === ACTION_TYPE.TOGGLE_FAV_FILM) {
//         toggleFavoriteFilm(userId, query.id, data)
//     } else if (type === ACTION_TYPE.SHOW_FILMS) {
//         sendFilmsByQuery(userId, {uuid: {'$in': data.filmUuids}})
//     }
// })
//
// bot.on('inline_query', query => {
//     Film.find({}).then((films: any) => {
//         const results = films.map((f: any) => {
//             return {
//                 id: f.uuid,
//                 type: 'photo',
//                 photo_url: f.picture,
//                 thumb_url: f.picture,
//                 caption: `Title: ${f.name}\nYear: ${f.year}\nRating: ${f.rate}\nDuration: ${f.length}\nCountry: ${f.country}`,
//                 reply_markup: {
//                     inline_keyboard: [
//                         [
//                             {
//                                 text: `Kinopoisk: ${f.name}`,
//                                 url: f.link
//                             }
//                         ]
//                     ]
//                 }
//             }
//         })
//
//         bot.answerInlineQuery(query.id, results, {
//             cache_time: 0
//         })
//     })
// })
//
// bot.onText(/\/start/, msg => {
//     const text = 'Hello' + msg.from!.first_name + "\nChoose option to continue: "
//     bot.sendMessage(getChatId(msg), text, {
//         reply_markup: {
//             keyboard: mainKb.home
//         }
//     })
//
// })
//
// bot.onText(/\/f(.+)/, (msg, arr: any) => {
//     const filmUuid: string = arr[1]
//
//     Promise.all([
//         Film.findOne({uuid: filmUuid}),
//         User.findOne({telegramId: msg.from!.id})
//     ]).then(([film, user]: any) => {
//
//         let isFav: boolean = false
//         if (user) {
//             isFav = user.films.indexOf(film.uuid) !== -1
//         }
//
//         const favText: string = isFav ? 'Delete from favorite' : 'Add to favorite'
//
//         const caption: string = `Title: ${film.name}\nYear: ${film.year}\nRating: ${film.rate}\nDuration: ${film.length}\nCountry: ${film.country}`
//
//         bot.sendPhoto(getChatId(msg), film.picture, {
//             caption: caption,
//             reply_markup: {
//                 inline_keyboard: [
//                     [{
//                         text: favText,
//                         callback_data: JSON.stringify({
//                             type: ACTION_TYPE.TOGGLE_FAV_FILM,
//                             filmUuid: film.uuid,
//                             isFav: isFav
//                         })
//                     },{
//                         text: 'Show cinemas',
//                         callback_data: JSON.stringify({
//                             type: ACTION_TYPE.SHOW_CINEMAS,
//                             cinemaUuids: film.cinemas
//                         })
//                     }],
//                     [{
//                         text: `Link to ${film.name}`,
//                         url: film.link
//                     }]
//                 ]
//             }
//         })
//     })
//
// })
// bot.onText(/\/c(.+)/, (msg, arr: any) => {
//     const cinemaUuid: string = arr[1]
//     Cinema.findOne({uuid: cinemaUuid}).then((cinema: any) => {
//         console.log(cinema)
//         bot.sendMessage(getChatId(msg), `Cinema ${cinema.name}`, {
//             reply_markup: {
//                 inline_keyboard: [
//                     [{
//                         text: cinema.name,
//                         url: cinema.url
//                     },
//                         {
//                             text: 'Show on map',
//                             callback_data: JSON.stringify({
//                                 type: ACTION_TYPE.SHOW_CINEMAS_MAP,
//                                 lat: cinema.location.latitude,
//                                 lon: cinema.location.longitude
//                             })
//                         }],
//                     [
//                         {
//                             text: "Show movies",
//                             callback_data: JSON.stringify({
//                                 type: ACTION_TYPE.SHOW_FILMS,
//                                 filmUuids: cinema.films
//                             })
//                         }
//                     ]
//                 ]
//             }
//         })
//     })
// })
//
// function sendFilmsByQuery (chatId:any, query:any) {
//     Film.find(query).then((films: FilmClass[]) => {
//         const html = films.map((f, i) => {
//             return `<b>${i+1}</b> ${f.name} - /f${f.uuid}`
//         }).join('\n')
//
//         sendHTML(chatId, html, 'films')
//     })
// }
//
// function sendHTML (chatId: string, html: any, kbName: string) {
//     const options: any = {
//         parse_mode: 'HTML',
//     }
//     if (kbName) {
//         options['reply_markup'] = {
//             keyboard: mainKb[kbName]
//         }
//     }
//     bot.sendMessage(chatId, html, options)
// }
//
// function getCinemasiInCoord(chatId: string, location: any) {
//     Cinema.find({}).then((cinemas: any) => {
// // use geolib if u want to get real trajet
//         const html: string = cinemas.map((c: any, i: number) => {
//             return `<b>${i + 1}</b> ${c.name}. <em>Trajet</em> - <strong>${1000}</strong>km. /c${c.uuid}`
//         }).join('\n')
//         sendHTML(chatId, html, 'home')
//
//     })
// }
//
// function toggleFavoriteFilm(userId: string, queryId: string, data: any) {
//
//     let userPromise
//
//     User.findOne({telegramId: userId})
//         .then((user: any) => {
//             if (user) {
//                 if (data.isFav) {
//                     user.films = user.films.filter((fUuid: string) => fUuid !== data.filmUuid)
//                 } else {
//                     user.films.push(data.filmUuid)
//                 }
//                 userPromise = user
//             } else {
//                 userPromise = new User({
//                     telegramId: userId,
//                     films: [data.filmUuid]
//                 })
//             }
//
//             const answerText = data.isFav ? 'Favorite film is deleted' : 'Film added to favorite'
//
//             userPromise.save().then(() => {
//                 bot.answerCallbackQuery({
//                     callback_query_id: queryId,
//                     text: answerText
//                 })
//             }).catch((err: string) => {console.log(err)})
//         }).catch((err: string) => {console.log(err)})
// }
//
// function showFavoriteFilms(chatId: string, userId: number) {
//     User.findOne({telegramId: userId})
//         .then((user: any) => {
//
//             if (user) {
//                 Film.find({uuid: {'$in': user.films}}).then((films: any) => {
//                     let html
//
//                     if (films.length) {
//                         html = films.map((f: any, i: number) => {
//                             return `<b>${i + 1}</b> ${f.name} - <b>${f.rate}</b> (/f${f.uuid}`
//                         }).join('\n')
//                     } else {
//                         html = 'Nothing added'
//                     }
//                     sendHTML(chatId, html, 'home')
//                 })
//             } else {
//                 sendHTML(chatId, 'Nothing was added yet', 'home')
//             }
//         })
//         .catch((err: string) => {
//             console.log(err)
//         })
// }
//
// function sendCinemasByQuery (userId: string, query: any) {
//     Cinema.find(query).then((cinemas: any) => {
//         const html = cinemas.map((c: any, i: number) => {
//             return `<b>${i + 1}</b> ${c.name} = - /c${c.uuid}`
//         }).join('\n')
//         sendHTML(userId, html, 'home')
//     })
// }
//////////////////////////////////////////////////////////////
// bot.onText(/\/contact/, msg => {
//     bot.sendContact(msg.chat.id, '89292002000', 'Some name', {
//         last_name: 'Last name'
//     })
// })
// bot.onText(/\/loc/, msg => {
//     // 43.261907, 76.929393
//     bot.sendLocation(msg.chat.id, 43.261907, 76.929393)
//
// })
// bot.onText(/\/v1/, msg => {
//     const chatId = msg.chat.id
//     bot.sendMessage(chatId, "Sending video...")
//     bot.sendVideo(chatId, 'http://techslides.com/demos/sample-videos/small.mp4', {
//         caption: 'Look at my hellicopter'
//     })
// })
// bot.onText(/\/v2/, msg => {
//     const chatId = msg.chat.id
//     bot.sendMessage(chatId, "Sending video...")
//     // mp4 only, otherwise send as sendDocument!
//     const filepath = __dirname + '/video.mkv'
//     fs.readFile(filepath, async (err, data) =>{
//         await bot.sendVideo(chatId, filepath)
//         bot.sendMessage(chatId, "Sending video is over")
//         await bot.sendVideoNote(chatId, filepath, {
//             duration: 1
//         })
//
//     })
//
// })
// bot.onText(/\/s1/, msg => {
//     bot.sendSticker(msg.chat.id, './ani.webp')
// })
//
// bot.onText(/\/s2/, msg => {
//
//     const filepath = __dirname + '/ani.webp'
//
//     fs.readFile(filepath, (err, data) => {
//         bot.sendSticker(msg.chat.id, filepath)
//     })
//
// })
// bot.onText(/\/doc1/, msg => {
//     bot.sendDocument(msg.chat.id, './joke.jpg')
// })
//
// bot.onText(/\/doc2/, msg => {
//
//     const filepath = __dirname + '/joke.jpg'
//
//     bot.sendMessage(msg.chat.id, 'Upload start...')
//
//     fs.readFile(filepath, (err, data) => {
//         bot.sendDocument(msg.chat.id, filepath, {
//             caption: 'This is still a joke'
//         }).then(() => {
//             bot.sendMessage(msg.chat.id, 'Upload is over')
//         })
//     })
//
// })
// bot.onText(/\/audio2/, msg => {
//     bot.sendMessage(msg.chat.id, 'Start audio uploading...')
//     const filepath: string = __dirname + '/song.mp3'
//     fs.readFile(filepath, (err, data) => {
//         bot.sendAudio(msg.chat.id, filepath).then(() => {
//             bot.sendMessage(msg.chat.id, 'Audio uploading is over')
//         })
//     })
// })
// bot.onText(/\/audio/, msg => {
//     bot.sendAudio(msg.chat.id, './song.mp3')
// })
// bot.onText(/\/pic2/, msg => {
//     bot.sendPhoto(msg.chat.id, './joke.jpg', {
//         caption: 'This is a joke'
//     })
// })
// bot.onText(/\/pic/, msg => {
//     bot.sendPhoto(msg.chat.id, fs.readFileSync(__dirname + '/joke.jpg'))
// })
// const inlineKeyboard = [
//     [
//         {
//             text: 'Forward',
//             callback_data: 'forward'
//         },
//         {
//             text: 'Reply',
//             callback_data: 'reply'
//         }
//     ],
//     [
//         {
//             text: 'Edit',
//             callback_data: 'edit'
//         },
//         {
//             text: 'Delete',
//             callback_data: 'delete'
//         }
//     ]
// ]
// bot.on('callback_query', query => {
//
//     const { chat, message_id, text } = query.message!
//
//     switch(query.data) {
//         case 'forward':
//             // where to send message where we send this message
//             // from where we take message
//             // id of message to send
//             bot.forwardMessage(chat.id, chat.id, message_id)
//             break
//         case 'reply':
//             bot.sendMessage(chat.id, 'Answering the message', {
//                 reply_to_message_id: message_id
//             })
//             break
//         case 'edit':
//             bot.editMessageText(`${text} (edited)`, {
//                 chat_id: chat.id,
//                 message_id: message_id,
//                 reply_markup: {
//                     inline_keyboard: inlineKeyboard
//                 }
//             })
//             break
//         case 'delete':
//             bot.deleteMessage(chat.id, message_id.toString())
//             break
//
//     }
//     bot.answerCallbackQuery({
//         callback_query_id: query.id
//     })
// })
//
// bot.onText(/\/start/, (msg, arr) => {
//     const chatId = msg.chat.id
//     bot.sendMessage(chatId, 'Keyboard', {
//         reply_markup: {
//             inline_keyboard: inlineKeyboard
//         }
//     })
// })
// bot.on('inline_query', query => {
//
//     let results: Array<InlineQueryObject>  = []
//
//     for (let i = 0; i < 5; i++) {
//
//         results[i] = (new InlineQueryObject('article', i.toString(), "Title " + (i+1), {message_text: 'Article number ' + (i+1)}))
//     }
//
//     bot.answerInlineQuery(query.id, results, {
//         cache_time: 0
//     })
// })
// bot.onText(/\/start/, msg => {
//     const id: number = msg.chat.id
//     bot.sendMessage(id, debug(msg))
// })
//
// bot.onText(/\/login (.+)/, (msg, arr) => {
//     const id: number = msg.chat.id
//
//     bot.sendMessage(id, arr ? arr[1] : "nothing")
// })
// bot.on('message', msg => {
//     const chatId = msg.chat.id
//
//     bot.sendMessage(chatId, 'Inline Keyboard', {
//         reply_markup: {
//             inline_keyboard: [
//                 [
//                     {
//                         text: 'Google',
//                         url: 'https://google.com'
//                     }
//                 ],
//                 [
//                     {
//                         text: 'Reply',
//                         callback_data: 'reply'
//                     },
//                     {
//                         text: 'Forward',
//                         callback_data: 'forward'
//                     }
//                 ]
//             ]
//         }
//     })
// })
//
// bot.on('callback_query', query => {
//     // bot.sendMessage(query.message!.chat.id, debug(query))
//
//     bot.answerCallbackQuery(query.id, {
//         text: query.data
//     })
// })
// bot.on('message', (msg) => {
//         const chatId = msg.chat.id
//
//         if (msg.text === 'Close') {
//             bot.sendMessage(chatId, 'Closing keyboard', {
//                 reply_markup: {
//                     remove_keyboard: true
//                 }
//             })
//         } else if (msg.text === 'Answer') {
//
//             bot.sendMessage(chatId, 'Answering', {
//                 reply_markup: {
//                     force_reply: true
//                 }
//             })
//
//         } else {
//             bot.sendMessage(chatId, 'Keyboard', {
//                 reply_markup: {
//                     keyboard: [
//                         [{
//                             text: 'Send location',
//                             request_location: true
//                         }],
//                         ['Answer', 'Close'],
//                         [{
//                             text: 'Send contact',
//                             request_contact: true
//                         }]
//                     ],
//                     one_time_keyboard: true
//                 }
//             })
//
//         }
// })
// bot.on('message', (msg) => {
//
//     setTimeout(() => {
//         bot.sendMessage(msg.chat.id, `https://www.youtube.com/watch?v=sCE9CpJLpo8&list=PLhgRAQ8BwWFaxlkNNtO0NDPmaVO9txRg8&index=12`, {
//             disable_web_page_preview: true,
//             disable_notification: true
//         })
//     }, 4000)
//
//
// })
// bot.on('message', (msg) => {
//
//     const markdown = `
//         *Hello, ${msg.from!.first_name}*
//         _Italic text_
//     `
//
//     bot.sendMessage(msg.chat.id, markdown, {
//         parse_mode: "Markdown"
//     })
// })
// bot.on('message', (msg) => {
//     const html = `
//             <strong>Hello, ${msg.from?.first_name}</strong>
//
//             <i>test message</i>
//
//             <pre>
//                 ${debug(msg)}
//             </pre>
//         `
//     bot.sendMessage(msg.chat.id, html, {
//         parse_mode: 'HTML'
//     })
// })
// bot.on('message', (msg) => {
//     console.log(msg)
//     if (msg.text?.toLowerCase() === 'hello') {
//         bot.sendMessage(msg.chat.id, `Hello ${msg.from?.first_name}`)
//     } else {
//         bot.sendMessage(msg.chat.id, debug(msg))
//             .then(() => {
//                 console.log("Message has been sent")
//             })
//             .catch((err) => {
//                 console.error(err)
//             })
//
//     }
//
// })
app.listen(8001, function () {
    console.log('connected to port ' + 8001);
});
