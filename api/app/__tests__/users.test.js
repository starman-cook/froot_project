const request = require ('supertest')
const mongoose = require ('mongoose')
const config = require ('../config')
const {app, port} = require('../../app.js')
const User = require('../models/User')

describe ('route-users', () => {
    const server = app.listen(port)
    let token
    let user
    let testUser
    beforeAll (async (done) => {
        try {
            await mongoose.connect(config.db.url + '/' + config.db.name, { useNewUrlParser: true, useUnifiedTopology: true });

            const userData = {
                workEmail: 'admin@admin.com',
                password: '12345a'
            }
            user = await request(server).post('/users/sessions').send(userData);
            token = user.body.user.token[0]
            testUser = await User.create ({
                workEmail: 'test_user@user.com',
                surname: 'Test',
                name: 'User',
                patronymic: 'U',
                position: 'User',
                telegramName: '@User',
                phone: '+7 777 777 77 77',
                password: '12345a'
            })
            done();
        }catch(e){
            console.log(e)
            done();
        }
    })
    afterAll(async(done) => {
        await User.findByIdAndDelete(testUser._id)
        await mongoose.connection.close()
        server.close()
        done()
    })
    test('Get all users ', async () => {
        const res = await request(server).get('/users').set({'Authorization': token})
        expect(res.statusCode).toBe(200)
        expect(res.body).toBeTruthy()
    })
    test ('Create new user', async () => {
        const newUser = {
                workEmail: 'new_user@user.com',
                surname: 'New',
                name: 'User',
                patronymic: 'U',
                position: 'User',
                telegramName: '@User',
                phone: '+7 777 777 77 77',
                password: '12345a'
            };
        const res = await request(server).post('/users').send(newUser)
        expect(res.statusCode).toBe(200)
        expect(res.body.workEmail).toBe('new_user@user.com')

        await User.findByIdAndDelete(res.body._id)
    })
    test ('Get user by id', async () => {
        const res = await request(server).get('/users/'+ testUser._id).set({'Authorization': token})
        expect(res.statusCode).toBe(200)
        expect(String(res.body._id)).toBe(String(testUser._id))
    })
    test ('Edit user', async () => {
        const editUser = {
            role: ['viewAllPayments', 'addPayment'],
            phone: '+7 777 777 77 55'
        }
        const res = await request(server).put('/users/'+ testUser._id +'/edit').send(editUser).set({'Authorization': token})
        expect(res.statusCode).toBe(200)
        expect(String(res.body._id)).toBe(String(testUser._id))
        expect(res.body.role.length).toBe(2)
    })
    test ('Delete user by id', async () => {
        const deleteUser = await User.create ({
            workEmail: 'deleted_user@user.com',
            surname: 'Deleted',
            name: 'User',
            patronymic: 'U',
            position: 'User',
            telegramName: '@User',
            phone: '+7 777 777 77 77',
            password: '12345a'
        })
        const res = await request(server).delete('/users/'+ deleteUser._id + '/delete').set({'Authorization': token})
        expect(res.statusCode).toBe(200)
        expect(res.body.message).toBe('user deleted!')
    })
    test('Login user ', async () => {
        const loginUser = {
            workEmail: 'test_user@user.com',
            password: '12345a'
        }
        const res = await request(server).post('/users/sessions').send(loginUser)
        expect(res.statusCode).toBe(200)
        expect(res.body.message).toBe('Email and password correct!')
    })
    test('Delete login sessions ', async () => {
        const res = await request(server).delete('/users/sessions').set({'Authorization': token});
        expect(res.statusCode).toBe(200)
        expect(res.body.message).toBe('Success')
    })
    test('Login-sessions in telegram ', async () => {
        const loginUser = {
            workEmail: 'test_user@user.com',
            password: '12345a'
        }
        const res = await request(server).post('/users/telegram_sessions').send(loginUser)
        expect(res.statusCode).toBe(200)
        expect(res.body.user.workEmail).toBe('test_user@user.com')
    })
})