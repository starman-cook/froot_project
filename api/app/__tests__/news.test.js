const request = require ('supertest')
const mongoose = require ('mongoose')
const config = require ('../config')
const {app, port} = require('../../app.js')
const News = require('../models/News')
const moment = require('moment');
const User = require('../models/User')

describe ('route-news', () => {
    const server = app.listen(port)
    let token
    let user
    let news
    let today
    beforeAll (async (done) => {
        try {
            await mongoose.connect(config.db.url + '/' + config.db.name, { useNewUrlParser: true, useUnifiedTopology: true });
        
            const userData = {
                workEmail: 'admin@admin.com',
                password: '12345a'
            }
            user = await request(server).post('/users/sessions').send(userData); 
            token = user.body.user.token[0]
            today = moment().format('DD-MM-YYYY')
            news = await News.create({
                user: user.body.user,
                file: 'news.xlsx',
                createDate: today,
                status: 'Не сделано'
            })
            done();
        }catch(e){
            console.log(e)
            done();
        }
    })
    afterAll(async(done) => { 
        await News.findByIdAndDelete(news._id)
        await mongoose.connection.close()
        server.close()
        done()
    })
    test ('Create new news', async () => {
        const newNews = {
            user: user.body.user,
            file: 'news.xlsx',
            createDate: today,
            status: 'Не сделано'
        }
        const res = await request(server).post('/news').send(newNews).set({'Authorization': token})

        expect(res.statusCode).toBe(200)
        expect(res.body.createDate).toBe(today)
        expect(String(res.body.user)).toBe(String(user.body.user._id))

        await News.findByIdAndDelete(res.body._id)
    }) 
    test ('Get news list', async () => {
        const res = await request(server).get('/news').set({'Authorization': token})
        expect(res.statusCode).toBe(200)
    }) 
    test ('Change status news', async () => {
        const contentUser = {
            workEmail: 'content_user@user.com',
            surname: 'Content',
            name: 'User',
            patronymic: 'U',
            position: 'User',
            telegramName: '@User',
            role: 'changeStatusNews',
            phone: '+7 777 777 77 77',
            password: '12345a'
        };
        await request(server).post('/users').send(contentUser)
        const contentUserData = {
            workEmail: 'content_user@user.com',
            password: '12345a'
        }
        const contentManager = await request(server).post('/users/sessions').send(contentUserData); 
        const tokenContentUser = contentManager.body.user.token[0]
        const status = 'В работе'
        var uri = '/news/' + news._id + '/' + status
        var URI = encodeURI(uri)

        const res = await request(server).get(URI).set({'Authorization': tokenContentUser})
        
        expect(res.statusCode).toBe(200)
        expect(res.body.status).toBe(status)

        await User.findByIdAndDelete(res.body.contentManager)
    }) 
})