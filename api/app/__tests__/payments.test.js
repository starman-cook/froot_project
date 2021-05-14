const request = require ('supertest')
const mongoose = require ('mongoose')
const config = require ('../config')
const {app, port} = require('../../app.js')
const Payment = require('../models/Payment')

describe ('route-payments', () => {
    console.log(process.env.NODE_ENV)
    const server = app.listen(port)
    let token
    let user
    let payment
    beforeAll (async (done) => {
        try {
            await mongoose.connect(config.db.url + '/' + config.db.name, { useNewUrlParser: true, useUnifiedTopology: true });
        
            const userData = {
                workEmail: 'admin@admin.com',
                password: '12345a'
            }
            user = await request(server).post('/users/sessions').send(userData); 
            token = user.body.user.token[0]
            payment = await Payment.create({
                user: user.body.user,
                paided: false,
                approved: false,
                repeatability: false,
                purpose: 'за товар',
                payer: 'Froot_Middle_Asia',
                invoice: '1',
                sum: '200000',
                dateOfPayment: '2021-02-27',
                contractor: 'P&G',
                priority: 'важный'
            })
            done();
        }catch(e){
            console.log(e)
            done();
        }
    })
    afterAll(async(done) => { 
        await Payment.findByIdAndDelete(payment._id)
        await mongoose.connection.close()
        server.close()
        done()
    })
    
    test ('Get payments list', async () => {
        const res = await request(server).get('/payments').set({'Authorization': token})
        expect(res.statusCode).toBe(200)
    }) 
    test ('Get payment by id', async () => {
        const res = await request(server).get('/payments/'+payment._id).set({'Authorization': token})

        expect(res.statusCode).toBe(200)
        expect(String(res.body._id)).toBe(String(payment._id))
    }) 
    test ('Create new payment', async () => {
        const newPayment = {
            user: user.body.user,
            paided: false,
            approved: false,
            repeatability: false,
            purpose: 'за товар',
            payer: 'Froot_Middle_Asia',
            invoice: '1',
            sum: '200000',
            dateOfPayment: '2021-02-27',
            contractor: 'P&G',
            priority: 'важный'
        }
        const res = await request(server).post('/payments').send(newPayment).set({'Authorization': token})

        expect(res.statusCode).toBe(200)
        expect(res.body.payer).toBe('Froot_Middle_Asia')

        await Payment.findByIdAndDelete(res.body._id)
    }) 
    test ('Get payments with filter', async () => {
        const filter = {
            payer: 'Froot_Бизнес',
            dateOfPayment: {
                toDate: '2021-02-27',
                fromDate: '2021-05-10',
              },
            approved: false,
            paided: false
        }
        const res = await request(server).post('/payments/filter', filter).set({'Authorization': token})
        
        expect(res.statusCode).toBe(200)
    }) 
    test ('Approved payment', async () => {
        const res = await request(server).get('/payments/'+ payment._id +'/approved').set({'Authorization': token})
        
        expect(res.statusCode).toBe(200)
        expect(res.body.approved).toBe(true)
    }) 
    test ('Cancel approved payment', async () => {
        const res = await request(server).get('/payments/'+ payment._id +'/approved/cancel').set({'Authorization': token})
        
        expect(res.statusCode).toBe(200)
        expect(res.body.approved).toBe(false)
    }) 
    test ('Paid payment', async () => {
        const res = await request(server).get('/payments/'+ payment._id +'/paid').set({'Authorization': token})
        if(payment.approved){
            expect(res.statusCode).toBe(200)
            expect(res.body.paided).toBe(true)
        }else {
            expect(res.statusCode).toBe(403)
            expect(res.body.message).toBe('Требуется одобрение директора')
        }
        
    }) 
    test ('Cancel paid payment', async () => {
        const res = await request(server).get('/payments/'+ payment._id +'/paid/cancel').set({'Authorization': token})
        
        expect(res.statusCode).toBe(200)
        expect(res.body.paided).toBe(false)
    }) 
    test ('Edit payment', async () => {
        const editData = {
            payer: 'Froot_Бизнес',
            sum: '100000',
            dateOfPayment: '2021-05-10',
        }
        const res = await request(server).put('/payments/'+ payment._id +'/edit').send(editData).set({'Authorization': token})
        expect(res.statusCode).toBe(200)
        expect(String(res.body._id)).toBe(String(payment._id))
        expect(res.body.payer).toBe('Froot_Бизнес')
    })       
    test ('Get payments list for today', async () => {
        const res = await request(server).get('/payments/due/today').set({'Authorization': token})
        expect(res.statusCode).toBe(200)
    })
    test ('Get all files of payments for today', async () => {
        const res = await request(server).get('/payments/files/today').set({'Authorization': token})
        expect(res.statusCode).toBe(200)
        expect(Array.isArray(res.body)).toBe(true)
    })
    test ('Stoped repeatability payment', async () => {
        const res = await request(server).post('/payments/'+ payment._id +'/not-repeatability').set({'Authorization': token})
        expect(res.statusCode).toBe(200)
        if (payment.repeatability) {
            expect(res.body.paided).toBe(false)
        }
    })
   
})