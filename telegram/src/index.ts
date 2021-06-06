import express from 'express'
import { applyImage, createTextForMessage, getChatId, getKeyBoard } from './app/helpers/helpers'
import TelegramBot from 'node-telegram-bot-api'
import cors from "cors"
import mongoose from 'mongoose'
import axios from 'axios'
import { kb } from "./app/helpers/kb";
import { User } from "./app/model/user-model";
import { UserModelInterface } from "./app/interfaces/user-model-interface";
import { config } from "./app/config";
import { upload } from "./app/upload";
import fs from 'fs';
import fetch from 'node-fetch';
import { mainKb } from "./app/helpers/keyboard";
import moment from "moment";


mongoose.connect(config.mongoUrl.url + config.mongoUrl.db, {
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

const bot = new TelegramBot(config.telegramToken, {
    polling: {
        interval: 300,
        autoStart: true,
        params: {
            timeout: 10
        }
    }
})

// Прием новых только что созданных заявок. Даже если она никому не будет отправлена изображение все равно сохранится для будущих реестров и уведомлений смен статусов
app.post('/telegram', upload.single('image'), async (req, res) => {
    if (req.body.image) {
        try {
            const response = await fetch(config.imagePathFromApi + "/uploads/" + req.body.image);
            const fileStream = fs.createWriteStream("./public/images/" + req.body.image);
            await new Promise((resolve, reject) => {
                response.body.pipe(fileStream);
                response.body.on("error", reject);
                fileStream.on("finish", resolve);
            });
        } catch (e) {
            console.log('error' + e)
        }
    }

    const users: Array<UserModelInterface> = await User.find({})

    try {
        for (let i = 0; i < users.length; i++) {
            let image = applyImage(req.body.image, fs)

            const html = createTextForMessage(req.body, `Hello, ${users[i].name}`, "Новая заявка", false)
            if (users[i].apiUserId === req.body.user || (users[i].role.includes('viewTodayPayments') && req.body.priority === 'Срочный')) {
                await botSendsPhoto(users[i].chatId, image, html, req)
            }
        }

        res.send({ message: "File was successfully received" })
    } catch (err) {
        console.log(err)
        res.status(400).send({ error: "could not receive data" })
    }
})

// Это функция для уведомления о предстоящем платеже создателя заявки
app.post('/telegram/:id/notification', async (req, res) => {
    await statusChangingBody(req, res, `Срок оплаты платежа через ${req.body.noticePeriod} дня`)
})

// Оповещение приглашенных пользователей о встрече
app.post('/telegram/calendarEvents', async (req, res) => {
    try {
        console.log(req.body);
        for (let i = 0; i < req.body.event.participants.length; i++) {
            const user = await User.findOne({ apiUserId: req.body.event.participants[i].userId });
            if (!user) continue;
            const fileMessage = req.body.event.file !== "null" && "доступны в деталях встречи на сайте во вкладке График встреч" || "нет";
            const date = moment(req.body.event.date, "DDMMYYYY")
            const meetingMessage = `
                <b>${user.name}, вы приглашены на встречу: ${req.body.event.title}</b>
                \nДата: ${date.format("DD-MM-YYYY")}
                \nВремя: с ${req.body.event.from} - до ${req.body.event.to}
                \nМесто: ${req.body.event.room}
                \nСоздатель: ${req.body.creator.name} ${req.body.creator.surname}
                \nОписание: ${req.body.event.description}
                \nМатериалы: ${fileMessage} 
                \nid: ${req.body.event._id}
            `
            await bot.sendMessage(user.chatId, meetingMessage, {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: kb.meeting.accept, callback_data: kb.meeting.accept },
                            { text: kb.meeting.reject, callback_data: kb.meeting.reject }
                        ]
                    ]
                }
            });
        }
        res.send({message: "Success"});
    } catch (error) {
        console.log(error); ////////
        res.status(500).send({ message: 'Telegram Error' })
    }
})

// Оповещение участников об отмененной встрече
app.post('/telegram/delete/calendarEvents', async (req, res) => {
    try {
        for (let i = 0; i < req.body.participants.length; i++) {
            const user = await User.findOne({ apiUserId: req.body.participants[i].userId });
            if (!user) continue;
            const date = moment(req.body.date, "DDMMYYYY")

            const meetingMessage = `
                <b>ВСТРЕЧА ОТМЕНЕНА</b>
                 \nДата: ${date.format("DD-MM-YYYY")}
                \nВремя: с ${req.body.from} - до ${req.body.to}
                \nМесто: ${req.body.room}
                \nОписание: ${req.body.description}
                \nid: ${req.body._id}
              
            `
            await bot.sendMessage(user.chatId, meetingMessage, {
                parse_mode: 'HTML',
            });
        }
        res.send({message: "Success"});
    } catch (error) {
        console.log(error); 
        res.status(500).send({ message: 'Telegram Error' })
    }
})


// Это функция для переноса заявок на следующий день
app.post('/telegram/:id/date', async (req, res) => {
    await statusChangingBody(req, res, "Ваша заявка перенесена на завтра")
})

// Это функция для подтверждения заявок
app.post('/telegram/:id/approved', async (req, res) => {
    await statusChangingBody(req, res, "Ваша заявка подтверждена")
})

// Это функция для уведомления об оплате заявки
app.post('/telegram/:id/paid', async (req, res) => {
    await statusChangingBody(req, res, "Ваша заявка оплачена")
})

// Здесь отрабатывают те кнопки, у которых в options задан callback_data
bot.on('callback_query', async query => {
    const { chat, message_id } = query.message!
    let id: string = "";
    if (query.data === 'approve' || query.data === 'tomorrow') {
        const captionArray = query.message!.caption!.split("\n")
        const idLine = captionArray[captionArray.length - 1].replace(/\s+/g, ' ').trim();
        id = idLine.split(" ")[1]
    }
    if (query.data === kb.meeting.accept || query.data === kb.meeting.reject) {
        const captionArray = query.message!.text.split("\n")
        const idLine = captionArray[captionArray.length - 1].replace(/\s+/g, ' ').trim();
        id = idLine.split(" ")[1]
    }
    try {
        const user = await User.findOne({ chatId: query.message!.chat.id })
        switch (query.data) {
            case 'delete':
                await bot.deleteMessage(chat.id, message_id.toString())
                break
            case 'approve':
                try {
                    await axios.get(`${config.localApiUrl}/payments/telegram/${id}/approved`, { headers: { Authorization: user.token } })
                    await bot.sendMessage(query.message!.chat.id, `Заявка ${id} подтверждена`)
                    await bot.deleteMessage(query.message!.chat.id, query.message!.message_id.toString())
                } catch (err) {
                    await bot.sendMessage(query.message!.chat.id, `Что-то пошло не так с заявкой ${id}, либо у вас нет прав на данное действие`)
                    throw new Error(err)
                }
                break
            case 'tomorrow':
                try {
                    await axios.get(`${config.localApiUrl}/payments/telegram/${id}/date`, { headers: { Authorization: user.token } })
                    await bot.sendMessage(query.message!.chat.id, `Заявка ${id} перенесена на завтра`)
                    await bot.deleteMessage(query.message!.chat.id, query.message!.message_id.toString())
                } catch (err) {
                    await bot.sendMessage(query.message!.chat.id, `Что-то пошло не так с заявкой ${id}, либо у вас нет прав на данное действие`)
                    throw new Error(err)
                }
                break
            case kb.meeting.accept:
                try {
                    await axios.get(`${config.localApiUrl}/calendarEvents/${id}/accept`, { headers: { Authorization: user.token } });
                    await bot.sendMessage(query.message!.chat.id, `Встреча ${id} принята`)
                    await bot.deleteMessage(query.message!.chat.id, query.message.message_id.toString())
                } catch (err) {
                    await bot.sendMessage(query.message!.chat.id, `Что-то пошло не так с принятием встречи ${id}, либо у вас нет прав на данное действие`)
                    throw new Error(err)
                }
                break
            case kb.meeting.reject:
                try {
                    await axios.get(`${config.localApiUrl}/calendarEvents/${id}/reject`, { headers: { Authorization: user.token } });
                    await bot.sendMessage(query.message!.chat.id, `Встреча ${id} отклонена`)
                    await bot.deleteMessage(query.message!.chat.id, query.message.message_id.toString())
                } catch (err) {
                    await bot.sendMessage(query.message!.chat.id, `Что-то пошло не так с отклонением встречи ${id}, либо у вас нет прав на данное действие`)
                    throw new Error(err)
                }
                break
        }
    } catch (err) {
        console.log("ERROR ", err)
    }

})

// Стандартная команда для начала работы, открывает главное меню
bot.onText(/\/start/, async msg => {
    const user = await User.findOne({ chatId: msg.chat.id })
    const text = 'Hello ' + msg.from!.first_name + "\nВыберите дальнейшие действия: "
    if (user) {
        const keyB = getKeyBoard(user)
        await bot.sendMessage(getChatId(msg), text, {
            reply_markup: {
                keyboard: keyB
            }
        })
    } else {
        await bot.sendMessage(getChatId(msg), text, {
            reply_markup: {
                keyboard: mainKb.homeUser
            }
        })
    }
})

// !!!Это основная функция, здесь происходит много всякого, отлов команд, получение реестра, кнопки всякие активируются!!!
bot.on('message', async msg => {
    const chatId = getChatId(msg)
    const user = await User.findOne({ chatId: chatId })
    let keyB
    if (user) {
        keyB = getKeyBoard(user)
    } else {
        keyB = mainKb.homeUser
    }

    switch (msg.text) {
        case kb.home.getPayments:
            try {
                const resp = await axios.get(`${config.localApiUrl}/payments/due/today/telegram`, { headers: { Authorization: user.token } })

                const headMessage = `
<b>Сегодняшние заявки</b>
<b>Всего заявок на сегодня: ${resp.data.length}шт</b>`
                await bot.sendMessage(chatId, headMessage, {
                    parse_mode: 'HTML'
                })

                for (let i = 0; i < resp.data.length; i++) {
                    if (resp.data.approved) continue;
                    let image = applyImage(resp.data[i].image, fs)
                    const numeration = `
<pre>  </pre>
            -------<b>${i + 1}</b>-------

`
                    await bot.sendMessage(chatId, numeration, { parse_mode: 'HTML' })
                    const html = createTextForMessage(resp.data[i], `Hello, ${msg.from!.first_name}`, "Заявка на сегодня: ", true)
                    await bot.sendPhoto(chatId, image, {
                        caption: html,
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [
                                [{
                                    text: 'Детали заявки',
                                    url: `${config.serverAdress}/payments/${resp.data[i]._id}`
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
                    })
                }
            } catch (err) {
                await bot.sendMessage(chatId, "Ваши права не позволяют просматривать реестр на сегодня")
            }
            break
        case kb.home.getToBePaid:
            try {
                const resp = await axios.get(`${config.localApiUrl}/payments/due/to-be-paid`, { headers: { Authorization: user.token } })

                const headMessage = `
<b>Заявки к оплате</b>
<b>Всего заявок на оплату: ${resp.data.length}шт</b>`
                await bot.sendMessage(chatId, headMessage, {
                    parse_mode: 'HTML'
                })

                for (let i = 0; i < resp.data.length; i++) {
                    if (resp.data.approved) continue;
                    let image = applyImage(resp.data[i].image, fs)
                    const numeration = `
<pre>  </pre>
            -------<b>${i + 1}</b>-------

`
                    await bot.sendMessage(chatId, numeration, { parse_mode: 'HTML' })
                    const html = createTextForMessage(resp.data[i], `Hello, ${msg.from!.first_name}`, "Заявка на оплату: ", true)
                    await bot.sendPhoto(chatId, image, {
                        caption: html,
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [
                                [{
                                    text: 'Детали заявки',
                                    url: `${config.serverAdress}/payments/${resp.data[i]._id}`
                                }]
                            ]
                        }
                    })
                }
            } catch (err) {
                await bot.sendMessage(chatId, "Ваши права не позволяют просматривать заявки на оплату")
            }
            break
        case kb.home.seeEvents:
            try {
                const resp = await axios.get(`${config.localApiUrl}/calendarEvents/${user.apiUserId}/myEvents`, { headers: { Authorization: user.token } })
                const headMessage = `
<b>Ваши предстоящие встечи ${user.name}</b>
<b>Всего встреч: ${resp.data.length}шт</b>`
                await bot.sendMessage(chatId, headMessage, {
                    parse_mode: 'HTML'
                })

                for (let i = 0; i < resp.data.length; i++) {
                    const participant = resp.data[i].participants.filter(p => p.userId === user.apiUserId)
                    console.log(participant[0])
                    const numeration = `
<pre>  </pre>
            -------<b>${i + 1}</b>-------

`
                    const fileMessage = resp.data[i].file !== "null" && "доступны в деталях встречи на сайте во вкладке График встреч" || "нет";
                    const date = moment(resp.data[i].date, "DDMMYYYY")
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
            `
                    await bot.sendMessage(user.chatId, numeration, {
                        parse_mode: 'HTML'
                    })
                    if (participant[0].accepted === null) {
                        await bot.sendMessage(user.chatId, meetingMessage, {
                            parse_mode: 'HTML',
                            reply_markup: {
                                inline_keyboard: [
                                    [
                                        { text: kb.meeting.accept, callback_data: kb.meeting.accept },
                                        { text: kb.meeting.reject, callback_data: kb.meeting.reject }
                                    ]
                                ]
                            }
                        });
                    } else {
                        await bot.sendMessage(user.chatId, meetingMessage, {
                            parse_mode: 'HTML',
                        });
                    }

                }
            } catch (err) {
                await bot.sendMessage(chatId, "Ваши права не позволяют просматривать предстоящие встречи")
            }
            break
        case kb.home.myPage:
            let opts = { 
                reply_markup: {
                    keyboard: [
                        [{ text: kb.loginPage!.info }],
                        [{ text: kb.goBack }]
                    ]
                }
            }
            if (user) {
                opts.reply_markup.keyboard.unshift([{ text: kb.loginPage!.logout }])
            } else {
                opts.reply_markup.keyboard.unshift([{ text: kb.loginPage!.login }])
            };

            await bot.sendMessage(getChatId(msg), "Ваше учетное меню", opts)
            break
        case kb.loginPage.info:
            if (!user) {
                await bot.sendMessage(chatId, "Данных нет")
            } else {
                const text = `
<b>${user.name}</b>
<b>Уровень доступа: ${user.role}</b>
                    `
                await bot.sendMessage(chatId, text, {
                    parse_mode: 'HTML'
                })
            }
            break
        case kb.loginPage.login:
            try {
                await bot.sendMessage(chatId, "Для входа введите одной строкой /login_ затем ваш email, ставите пробел и пишите пароль (тот что вы создали при регистрации на десктопной версии), затем отправляете данное сообщение, ответ придет через несколько секунд.")
            } catch (err) {
                await bot.sendMessage(chatId, 'Ошибка при регистрации: ' + err)
            }
            break
        case kb.loginPage.logout:
            try {
                const user = await User.findOne({ chatId: chatId })
                user.delete()
                await bot.sendMessage(chatId, 'Вы разлогинились')
            } catch (err) {
                await bot.sendMessage(chatId, 'Ошибка при выходе из учетной записи: ' + err)
            }

            break
        case kb.goBack:
            await bot.sendMessage(chatId, 'Основное меню', {
                reply_markup: {
                    keyboard: keyB
                }
            })
            break
        case kb.home.close:
            await bot.sendMessage(chatId, 'Закрыть меню', {
                reply_markup: {
                    remove_keyboard: true
                }
            })
            break
    }
})

// Функция регистрации, через регулярку получаем все что после /login_ и отправляем запрос на апи для аутентификации, пользователь и его данные сохраняются здесь локально
bot.onText(/\/login_(.+)/, async (msg, arr: any) => {
    try {
        const userInputArray = arr[1].replace(/\s+/g, ' ').trim().split(" ")
        const userReadyToSendData = {
            workEmail: userInputArray[0],
            password: userInputArray[1]
        }
        const response = await axios.post(config.localApiUrl + "/users/telegram_sessions", userReadyToSendData)
        const user = await User.findOne({ chatId: msg.chat.id })
        if (user) {
            await user.delete()
        }
        await new User({
            chatId: msg.chat.id,
            role: response.data.user.role,
            name: msg.from!.first_name,
            token: response.data.user.token[1],
            apiUserId: response.data.user._id
        }).save()
        await bot.sendMessage(msg.chat.id, "Регистрация прошла успешно")
        await bot.sendMessage(msg.chat.id, 'Меню закрывается для обновления, введите /start чтобы вновь открыть основное меню, если не было сообщений об ошибке, то сообщение с вашим e-mail и паролем будет удаленно автоматически через 10 секунд', {
            reply_markup: {
                remove_keyboard: true
            }
        })
        setTimeout(() => {
            bot.deleteMessage(msg.chat.id, msg.message_id.toString())
        }, 10000)
    } catch (err) {
        await bot.sendMessage(msg.chat.id, "Ошибка ввода")
    }
})

// Создание ответного сообщения при смене статуса, находит инициатора и уведомляет его (или ее)
async function statusChangingBody(req: any, res: any, text: string) {
    const userId: string = req.params.id
    const user = await User.findOne({ apiUserId: userId })
    let image: string = applyImage(req.body.image, fs)
    if(user) {
        const html = createTextForMessage(req.body, `${user.name}, ${text}`, "Данные по заявке: ", false)
        await botSendsPhoto(user.chatId, image, html, req)
        res.send({ message: "Все круто" })
    } else res.status(404).send({ message: "user not found" })
    
}

// Бот формирует стандартное сообщение
async function botSendsPhoto(chatId: string, image: string, html: string, req: any) {
    await bot.sendPhoto(chatId, image, {
        caption: html,
        parse_mode: 'HTML',
        reply_markup: {
            inline_keyboard: [
                [{
                    text: 'Детали заявки',
                    url: `${config.serverAdress}/payments/${req.body._id}`
                }],
                [{
                    text: "Удалить из сообщений",
                    callback_data: 'delete'
                }]
            ]
        }
    })
}


app.listen(config.telegramPort, () => {
    console.log('connected to port ' + config.telegramPort)
})

