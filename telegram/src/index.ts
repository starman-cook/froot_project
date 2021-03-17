import express from 'express'
import { getChatId } from './app/helpers/helpers'
import TelegramBot from 'node-telegram-bot-api'
import cors from "cors"
import mongoose from 'mongoose'
import axios from 'axios'
import {mainKb} from "./app/helpers/keyboard";
import {kb} from "./app/helpers/kb";
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

    const text = 'Hello ' + msg.from!.first_name + "\nВыберите дальнейшие действия: "
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
                break
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
            case kb.home.myPage:
                const typeBtn: string = user ? kb.loginPage!.logout : kb.loginPage!.register
                const text: string = user ? "Вы уже зарегистрированы" : "Чтобы продолжить работу зарегистрируйтесь"
                bot.sendMessage(getChatId(msg), text, {
                    reply_markup: {
                        keyboard: [
                            [{text: typeBtn}],
                            [{text: kb.goBack}]
                                ]
                            }
                })
                break
            case kb.loginPage.register:
                bot.sendMessage(chatId, 'THIS WILL BE REGISTRATION')
                break
            case kb.loginPage.logout:
                bot.sendMessage(chatId, 'THIS WILL BE LOGOUT')
                break
            case kb.goBack:
                bot.sendMessage(chatId, 'Основное меню', {
                    reply_markup: {
                        keyboard: mainKb.home
                    }
                })
                break
            case kb.home.close:
                bot.sendMessage(chatId, 'closing', {
                    reply_markup: {
                        remove_keyboard: true
                    }
                })
                break
        }
    }
})

app.listen(8001, () => {
    console.log('connected to port ' + 8001)
})