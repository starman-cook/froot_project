const request = require ('supertest')
const mongoose = require ('mongoose')
const config = require ('../config')
const {app, port} = require('../../app.js')
const User = require('../models/User')
const CalendarEvent = require('../models/CalendarEvent')
const moment = require('moment')
const Room = require('../models/Room')

describe ('route-calendarEvents', () => {
    const server = app.listen(port)

    let today
    let token
    let user
    let room
    let calendarEvent
    beforeAll (async (done) => {
        try {
            await mongoose.connect(config.db.url + '/' + config.db.name, { useNewUrlParser: true, useUnifiedTopology: true });

            const userData = {
                workEmail: 'admin@admin.com',
                password: '12345a'
            }
            user = await request(server).post('/users/sessions').send(userData);
            token = user.body.user.token[0]
            room = await Room.create({
                room: 'test room'
            })
            today = moment().format('DDMMYYYY')
            calendarEvent = await CalendarEvent.create({
                user: user.body.user,
                color: "rgb(254, 163, 189)",
                date: today,
                title: "Встреча",
                description: "Описание",
                monthYear: "052021",
                participants: `[{"userId":"60a52422519b48188e22f2ae","name":"Admin","surname":"Admin","position":"admin","accepted":null},
                                {"userId":"60a74b5f519b48188e22f2b4","name":"Директор","surname":"Директор","position":"директор","accepted":null}]`,
                room: room.room,
                scale: ["10:00", "10:30"],
                from: "10:00",
                to: "11:00"
            })
            done();
        }catch(e){
            console.log(e)
            done();
        }
    })
    afterAll(async(done) => {
        try {
            await Room.findByIdAndDelete(room._id)
            await CalendarEvent.findByIdAndDelete(calendarEvent._id)
            await mongoose.connection.close()
            server.close()
            done()
        }catch(e){
            console.log(e)
            done();
        }
    })
    test ('Create new calendarEvent', async () => {
        const newCalendarEvent = {
            user: user.body.user,
                monthYear: '052021',
                color: 'rgb(254, 163, 180)',
                title: 'Встреча 1',
                description: 'Описание',
                participants: `[{"userId":"60a52422519b48188e22f2ae","name":"Admin","surname":"Admin","position":"admin","accepted":null},
                                {"userId":"60a74b5f519b48188e22f2b4","name":"Директор","surname":"Директор","position":"директор","accepted":null}]`,
                room: '1',
                date: '24052021',
                scale: ['10:00', '10:30'],
                from: '10:00',
                to: '10:30'
        }
        const res = await request(server).post('/calendarEvents').send(newCalendarEvent).set({'Authorization': token})

        expect(res.statusCode).toBe(200)
        expect(res.body.title).toBe('Встреча 1')

        await CalendarEvent.findByIdAndDelete(res.body._id)
    })
    test ('Get busy month', async () => {
        today = moment().format('MMYYYY')
        const res = await request(server).get(`/calendarEvents/${room.room}/${today}/monthly`).set({'Authorization': token})

        expect(res.statusCode).toBe(200)
        expect(res.body.room).toBe('test room')
        expect(res.body.date).toBe(today)
    })
    test ('Get busy daily', async () => {
        today = moment().format('DDMMYYYY')
        const res = await request(server).get(`/calendarEvents/${room.room}/${today}/daily`).set({'Authorization': token})
        expect(res.statusCode).toBe(200)
        expect(res.body[0].room).toBe('test room')
        expect(res.body[0].date).toBe(today)
    })
    test ('Delete calendarEvent by id', async () => {
        const eventForDelete = await CalendarEvent.create({
            user: user.body.user,
            color: "rgb(254, 163, 189)",
            date: today,
            title: "Тема",
            description: "Описание",
            monthYear: "052021",
            participants: `[{"userId":"60a52422519b48188e22f2ae","name":"Admin","surname":"Admin","position":"admin","accepted":null},
                            {"userId":"60a74b5f519b48188e22f2b4","name":"Директор","surname":"Директор","position":"директор","accepted":null}]`,
            room: room.room,
            scale: ["10:00", "10:30"],
            from: "10:00",
            to: "11:00"
        })
        const res = await request(server).delete('/calendarEvents/'+ eventForDelete._id).set({'Authorization': token})
        expect(res.statusCode).toBe(200)
        expect(res.body.message).toBe("Success")
    })
})