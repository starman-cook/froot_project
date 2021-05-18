const request = require('supertest');
// const app = require("../../server");
const { app, port } = require('../../app');
const mongoose = require('mongoose');
const config = require('../config');
const Contentlink = require('../models/Contentlink');

describe('route/contentlinks', () => {
    // console.log(process.env.NODE_ENV); ///

    const server = app.listen(port)

    beforeAll(async done => {
        try {
            await mongoose.connect(config.db.url + '/' + config.db.name, { useNewUrlParser: true, useUnifiedTopology: true });
            done();
        } catch (error) {
            console.log(error);
            done();
        }
    });

    afterAll(async done => {
        try {
            await mongoose.connection.close();
            server.close();
            done();
        } catch (error) {
            console.log(error);
            done();
        }
    });

    //сценарий шагов - login user, get user token, put token into headers, test routers
    const mockUser = { "workEmail": "admin@admin.com", "password": "12345a" };
    let token;
    const mockContentlink = { "url": "https://www.google.com", "merchent": "google" };

    it('Login user', async done => {
        const res = await request(server)
            .post('/users/sessions')
            .send(mockUser)
            .expect(200);
        token = res.body.user.token[0];
        done();
    });

    it('Add contentlink', async done => {
        const res = await request(server)
            .post('/contentlinks')
            .send(mockContentlink)
            .set('Authorization', token)
            .expect(200);
        await Contentlink.findByIdAndDelete(res.body._id);
        done();
    }, 10000);

    it('Get own contentlinks', async done => {
        const res = await request(server)
            .get('/contentlinks')
            .set('Authorization', token)
            .expect(200);
        done();
    });

    it('Get all contentlinks', async done => {
        const res = await request(server)
            .get('/contentlinks/all')
            .set('Authorization', token)
            .expect(200);
        done();
    });

});