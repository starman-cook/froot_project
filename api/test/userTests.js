process.env.NODE_ENV='test';

const chai=require('chai');
const app=require('../server');
const chaiHttp=require('chai-http');
const conn=require('../app/db');
const mongoose=require('mongoose');
const User=require('../app/models/User');

chai.should();
chai.use(chaiHttp);

describe('USERS',()=>{
    before((done)=>{
        conn.mongoConnect()
            .then(()=>{
                // mongoose.connection.once('open', async () => {
                //     try {
                //         await db.dropCollection('users');
                //     } catch (e) {
                //         console.log('Collection were not present, skipping drop...')
                //     }
                //     await User.create({
                //         workEmail: "admin@admin.com",
                //         surname: "Admin",
                //         name: "Admin",
                //         patronymic: "Admin",
                //         position: "admin",
                //         telegramName: "@admin",
                //         phone: "+7 555 555 55 55",
                //         password: "12345a",
                //         role: ['viewAllPayments', 'stopRepeatabilityPayment', 'addPayment', 'editPayment', 'approvePayment', 'payPayment', 'postponePayment', 'viewToBePaid', 'viewTodayPayments', 'initCancelApprovedPayment', 'cancelApprovedPayment', 'initCancelPayedPayment', 'cancelPayedPayment', 'deletePayment', 'authorizeUser', 'editUser', 'deleteUser', 'viewUsers', 'bookMeetingRoom', 'editBookedMeetingRoom', 'deleteBookedMeetingRoom', 'viewBookingsMeetingRoom'],
                //         token: ['adminToken', 'adminToken']
                //     });

                // })
                // console.log('fixtures connected');
                done()
            })
            // .then(()=>done())
            .catch((err)=>done(err));
    });
    after((done)=>{
        conn.mongoDisconnect()
            .then(()=>done())
            .catch((err)=>done(err));
    })
    //GET
    describe('GET /users',()=>{
        
        it('it shold get all users',(done)=>{
            chai.request(app)
                .get('/users')
                .set({Authorization:'adminToken'})
                .end((err,response)=>{
                    response.should.have.status(200);
                    response.body.should.be.a('array');
                    done();
                })
        });
        
    })
    //POST
        describe('POST /users',()=>{
            it('it should post new user',(done)=>{
                const newUser={
                    workEmail:'test@test.com',
                    surname:'test',
                    name:'test',
                    patronymic:'test',
                    telegramName:'test',
                    phone:'87772772727',
                    password:'12345a'
                };
                chai.request(app)
                    .post('/users')
                    .send(newUser)
                    .end((err,response)=>{
                        response.should.have.status(200);
                        response.body.should.be.a('object');
                        response.body.should.have.property('workEmail').eq('test@test.com');
                        done();
                    })
            })
        })
})