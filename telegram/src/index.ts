import express from 'express'
import {debug, getChatId } from './app/helpers/helpers'
import TelegramBot from 'node-telegram-bot-api'
import cors from "cors"
// import {InlineQueryObject} from "./classes/inlineQueryObject";
import mongoose from 'mongoose'
import axios from 'axios'


import fs from 'fs'
import {mainKb} from "./app/helpers/keyboard";
import {kb} from "./app/helpers/kb";
// import {Film} from "./model/film-model";
// import {Cinema} from "./model/cinema-model";
// import { FilmClass } from './classes/FilmClass';
import {User} from "./app/model/user-model";
import {UserModelInterface} from "./app/interfaces/user-model-interface";

mongoose.connect('mongodb+srv://QWE123:QWE123@cluster0.rrd3k.mongodb.net/telega3\n', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("Mongo connected")
    })
    .catch(err => {
        console.log(err)
    })

// const FilmClass = mongoose.model('films')




// const ACTION_TYPE = {
//     TOGGLE_FAV_FILM: 'tff',
//     SHOW_CINEMAS: 'sc',
//     SHOW_CINEMAS_MAP: 'scm',
//     SHOW_FILMS: 'sf'
// }



// console.log(FilmClass.find())

const app: express.Application = express();
app.use(cors())
app.use(express.json())



const TOKEN = '1688455909:AAG6JNSW5JfBA8Z5JrkS22EbnbJPuZk1SpI'

const bot = new TelegramBot(TOKEN, {
    polling: {
        interval: 300,
        autoStart: true,
        params: {
            timeout: 10
        }
    }
})
app.post('/telegram', async (req, res) => {
    const users: Array<UserModelInterface> = await User.find({})

    try {
        for (let i = 0; i < users.length; i++) {
            let image;
            if (req.body.image && req.body.image === 'somestuff') {
                image = `http://localhost:8000/uploads/${req.body.image}`
            } else {
                image = './public/images/default.png'
            }
            const html = `
                                <strong>Hello, ${users[i].name}</strong>
                    
                                                    <i>Новая заявка:</i>
                    
<b>Категория: </b>      <pre>${req.body.priority}</pre>
<b>Статус: </b>         <pre>${req.body.approved ? "Подтвержден" : req.body.paided ? "Оплачен" : "Еще не подтверждена"}</pre>
<b>Назначение: </b>     <pre>${req.body.purpose}</pre>
<b>Плательщик: </b>     <pre>${req.body.payer}</pre>
<b>Контрактор: </b>     <pre>${req.body.contractor}</pre>
<b>Дата платежа: </b>   <pre>${req.body.dateOfPayment}</pre>
<b>Сумма: </b>          <pre>${req.body.sum} тг</pre>
                            `
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
            })
        }
    } catch (err) {
        console.log(err)
    }
})


bot.on('callback_query', async query => {
    const { chat, message_id, text } = query.message!
    let id;
    if (query.data === 'approve' || query.data === 'tomorrow') {
        const captionArray = query.message!.caption!.split("\n")
        const idLine = captionArray[captionArray.length - 1].replace(/\s+/g,' ').trim();
        id = idLine.split(" ")[1]
    }

    switch(query.data) {
        case 'delete':
            bot.deleteMessage(chat.id, message_id.toString())
            break
        case 'approve':
            try {
                await axios.post(`http://localhost:8000/payments/telegram/${id}/approved`)
                bot.sendMessage(query.message!.chat.id, `Заявка ${id} подтверждена`)
            } catch(err) {
                bot.sendMessage(query.message!.chat.id, `Что-то пошло не так с заявкой ${id}`)
                throw new Error(err)
            }
                break
        case 'tomorrow':
            try {
                await axios.post(`http://localhost:8000/payments/telegram/${id}/date`)
                bot.sendMessage(query.message!.chat.id, `Заявка ${id} перенесена на завтра`)
            } catch(err) {
                bot.sendMessage(query.message!.chat.id, `Что-то пошло не так с заявкой ${id}`)
                throw new Error(err)
            }
            break
    }
    bot.answerCallbackQuery({
        callback_query_id: query.id
    })
})


bot.onText(/\/start/, async msg => {
    let user = await User.findOne({chatId: msg.chat!.id})

    if (!user) {
        await new User({chatId: msg.chat.id, role: 'user', name: msg.from!.first_name}).save()
    }

    const text = 'Hello' + msg.from!.first_name + "\nChoose option to continue: "
    bot.sendMessage(getChatId(msg), text, {
        reply_markup: {
            keyboard: mainKb.home
        }
    })
})

bot.on('message', async msg => {
    const chatId = getChatId(msg)
    const user = await User.findOne({chatId: chatId})
    if (user.role !== 'user') {
        switch(msg.text) {
            case kb.home.getPayments:
                bot.sendMessage(chatId, "Unauthorized")
                break
            case kb.home.close:
                bot.sendMessage(chatId, 'closing', {
                    reply_markup: {
                        remove_keyboard: true
                    }
                })
        }
    } else {
        switch(msg.text) {
            case kb.home.getPayments:

                const resp = await axios.get('http://localhost:8000/payments/today', {headers: {Authorization: "ukACJRbddCiW4J--qk9Xu"}})

                const headMessage = `
<b>Сегодняшние заявки</b>
<b>Всего заявок на сегодня: ${resp.data.length}шт</b>`
                bot.sendMessage(chatId, headMessage, {
                    parse_mode: 'HTML'
                })

                for (let i = 0; i < resp.data.length; i++) {

                    let image;
                    if (resp.data[i].image && resp.data[i].image === 'somestuff') {
                        image = `http://localhost:8000/uploads/${resp.data[i].image}`
                    } else {
                        image = './public/images/default.png'
                    }


                    const html = `
                                <strong>Hello, ${msg.from!.first_name}</strong>
                    
                                                    <i>Заявка на сегодня:</i>
                    
<b>Категория: </b>      <pre>${resp.data[i].priority}</pre>
<b>Статус: </b>         <pre>${resp.data[i].approved ? "Подтвержден" : resp.data[i].paided ? "Оплачен" : "Еще не подтверждена"}</pre>
<b>Назначение: </b>     <pre>${resp.data[i].purpose}</pre>
<b>Плательщик: </b>     <pre>${resp.data[i].payer}</pre>
<b>Контрактор: </b>     <pre>${resp.data[i].contractor}</pre>
<b>Дата платежа: </b>   <pre>${resp.data[i].dateOfPayment}</pre>
<b>Сумма: </b>          <pre>${resp.data[i].sum} тг</pre>
<b>id: </b>             <pre>${resp.data[i]._id}</pre>
                            `
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
                        }})
                }




                break
            case kb.home.close:
                bot.sendMessage(chatId, 'closing', {
                    reply_markup: {
                        remove_keyboard: true
                    }
                })
        }
    }
})

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



app.listen(8001, () => {
    console.log('connected to port ' + 8001)
})