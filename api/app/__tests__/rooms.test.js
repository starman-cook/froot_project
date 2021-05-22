const request =  require ('supertest')
const mongoose = require ('mongoose')
const config = require ('../config')
const {app, port} = require('../../app.js')
const Room = require ('../models/Room')

describe ('route-rooms', () => {
    const server = app.listen(port)
    
    beforeAll (async (done) => {
        try {
            await mongoose.connect(config.db.url + '/' + config.db.name, { useNewUrlParser: true, useUnifiedTopology: true });
            done();
        }catch(e){
            console.log(e)
            done();
        }
    })
    afterAll(async(done) => { 
        try {
            await mongoose.connection.close()
            server.close()
            done() 
        }catch(e){
            console.log(e)
            done();
        }
    })
    test ('Create new room', async () => {
        const newRoom = {
            room: 'test room'
        }
        const res = await request(server).post('/rooms').send(newRoom)

        expect(res.statusCode).toBe(200)
        expect(res.body.room).toBe('test room')

        await Room.findByIdAndDelete(res.body._id)
    }) 
    test ('Get rooms list', async () => {
        const res = await request(server).get('/rooms')
        expect(res.statusCode).toBe(200)
    }) 
    test ('Delete room by id', async () => {
        const deleteRoom = await Room.create ({
            room: 'room to be deleted'
        })
        const res = await request(server).delete('/rooms/'+ deleteRoom._id)
        expect(res.statusCode).toBe(200)
        expect(res.body.message).toBe('Success')
    }) 
})