import express from 'express'
import {applyImage, createTextForMessage, getChatId} from './app/helpers/helpers'
import TelegramBot from 'node-telegram-bot-api'
import cors from "cors"
import mongoose from 'mongoose'
import axios from 'axios'
import {mainKb} from "./app/helpers/keyboard";
import {kb} from "./app/helpers/kb";
import {User} from "./app/model/user-model";
import {UserModelInterface} from "./app/interfaces/user-model-interface";
import {config} from "./app/config";
import {upload} from "./app/upload";
import fs from 'fs';
import fetch from 'node-fetch';


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
            const response = await fetch("http://" + process.env.BACKEND_HOST + ":8000/uploads/" + req.body.image);
            // const response = await fetch(config.imagePathFromApi+ "/uploads/" + req.body.image);
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
            if (users[i].apiUserId === req.body.user || (users[i].role === 'director' && req.body.priority === 'Срочный')) {
                await botSendsPhoto(users[i].chatId, image, html)
            }
            }

        res.send({message: "File was successfully received"})
    } catch (err) {
        console.log(err)
        res.status(400).send({error: "could not receive data"})
    }
})

// Это функция для переноса заявок на следующий день
app.post('/telegram/:id/date', async (req, res) => {
    await dateAndApproveChangingBody(req, res, "Ваша заявка перенесена на завтра")
})

// Это функция для подтверждения заявок
app.post('/telegram/:id/approved', async (req, res) => {
    await dateAndApproveChangingBody(req, res, "Ваша заявка подтверждена")
})

// Здесь отрабатывают те кнопки, у которых в options задан callback_data
bot.on('callback_query', async query => {
    const { chat, message_id } = query.message!
    let id: string = "";
    if (query.data === 'approve' || query.data === 'tomorrow') {
        const captionArray = query.message!.caption!.split("\n")
        const idLine = captionArray[captionArray.length - 1].replace(/\s+/g,' ').trim();
        id = idLine.split(" ")[1]
    }

    switch(query.data) {
        case 'delete':
            await bot.deleteMessage(chat.id, message_id.toString())
            break
        case 'approve':
            try {
                await axios.post(`${config.localApiUrl}/payments/telegram/${id}/approved`)
                await bot.sendMessage(query.message!.chat.id, `Заявка ${id} подтверждена`)
            } catch(err) {
                await bot.sendMessage(query.message!.chat.id, `Что-то пошло не так с заявкой ${id}`)
                throw new Error(err)
            }
                break
        case 'tomorrow':
            try {
                await axios.post(`${config.localApiUrl}/payments/telegram/${id}/date`)
                await bot.sendMessage(query.message!.chat.id, `Заявка ${id} перенесена на завтра`)
            } catch(err) {
                await bot.sendMessage(query.message!.chat.id, `Что-то пошло не так с заявкой ${id}`)
                throw new Error(err)
            }
            break
    }
})

// Стандартная команда для начала работы, открывает главное меню
bot.onText(/\/start/, async msg => {
    const text = 'Hello ' + msg.from!.first_name + "\nВыберите дальнейшие действия: "
    await bot.sendMessage(getChatId(msg), text, {
        reply_markup: {
            keyboard: mainKb.home
        }
    })
})

// Это основная функция, здесь происходит много всякого, отлов команд, получение реестра, кнопки всякие активируются
bot.on('message', async msg => {
    const chatId = getChatId(msg)
    const user = await User.findOne({chatId: chatId})

        switch(msg.text) {
            case kb.home.getPayments:
                try {
                    const resp = await axios.get(`${config.localApiUrl}/payments/due/today`, {headers: {Authorization: user.token}})

                    const headMessage = `
<b>Сегодняшние заявки</b>
<b>Всего заявок на сегодня: ${resp.data.length}шт</b>`
                    await bot.sendMessage(chatId, headMessage, {
                        parse_mode: 'HTML'
                    })

                    for (let i = 0; i < resp.data.length; i++) {
                        let image = applyImage(resp.data[i].image, fs)
                        const numeration = `
<pre>  </pre>
            -------<b>${i + 1}</b>-------

`
                        await bot.sendMessage(chatId, numeration, {parse_mode: 'HTML'})
                        const html = createTextForMessage(resp.data[i], `Hello, ${msg.from!.first_name}`, "Заявка на сегодня: ", true)
                        await bot.sendPhoto(chatId, image, {
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
                            }})
                    }
                } catch(err) {
                    await bot.sendMessage(chatId, "Ваши права не позволяют просматривать реестр на сегодня")
                }
                break
            case kb.home.myPage:
                await bot.sendMessage(getChatId(msg), "Ваше учетное меню", {
                    reply_markup: {
                        keyboard: [
                            [{text: kb.loginPage!.logout}],
                            [{text: kb.loginPage!.register}],
                            [{text: kb.loginPage!.info}],
                            [{text: kb.goBack}]
                                ]
                            }
                })
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
            case kb.loginPage.register:
                try {
                    await bot.sendMessage(chatId, "Для регистрации введите одной строкой /login_ затем ваш email, ставите пробел и пишите пароль, затем отправляете данное сообщение, ответ придет через несколько секунд.")
                } catch(err) {
                    await bot.sendMessage(chatId, 'Ошибка при регистрации: ' + err)
                }
                break
            case kb.loginPage.logout:
                try {
                    const user = await User.findOne({chatId: chatId})
                    user.delete()
                    await bot.sendMessage(chatId, 'Вы разлогинились')
                } catch (err) {
                    await bot.sendMessage(chatId, 'Ошибка при удалении учетной записи: ' + err)
                }

                break
            case kb.goBack:
                await bot.sendMessage(chatId, 'Основное меню', {
                    reply_markup: {
                        keyboard: mainKb.home
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
            const userInputArray = arr[1].replace(/\s+/g,' ').trim().split(" ")
            const userReadyToSendData = {
                workEmail: userInputArray[0],
                password: userInputArray[1]
            }
            const response = await axios.post(config.localApiUrl + "/users/telegram_sessions", userReadyToSendData)
            const user = await User.findOne({chatId: msg.chat.id})
            if (user) {
              await user.delete()
            }
            await new User({
                chatId: msg.chat.id,
                role: response.data.user.role,
                name: msg.from!.first_name,
                token: response.data.user.token,
                apiUserId: response.data.user._id}).save()
            await bot.sendMessage(msg.chat.id, "Регистрация прошла успешно")
        } catch(err) {
            await bot.sendMessage(msg.chat.id, "Ошибка ввода")
        }
    })

// Создание ответного сообщения при смене статуса, находит инициатора и уведомляет его (или ее)
async function dateAndApproveChangingBody(req: any, res: any, text: string) {
    const userId: string = req.params.id
    const user = await User.findOne({apiUserId: userId})
    if (!user) res.status(404).send({message: "user not found"})
    let image: string = applyImage(req.body.image, fs)

    const html = createTextForMessage(req.body, `${user.name}, ${text}`, "Данные по заявке: ", false)
    await botSendsPhoto(user.chatId, image, html)
    res.send({message: "Все круто"})
}

// Бот формирует стандартное сообщение
async function botSendsPhoto(chatId: string, image: string, html: string) {
    await bot.sendPhoto(chatId, image, {
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

app.listen(config.telegramPort, () => {
    console.log('connected to port ' + config.telegramPort)
})

