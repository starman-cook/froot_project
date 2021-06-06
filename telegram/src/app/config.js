"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
let baseUrlForBackend = process.env.BACKEND_HOST;
let userMongo = process.env.MONGO_USER;
let passwordMongo = process.env.MONGO_PASS;
let hostMongo = process.env.MONGO_HOST;
let dbMongo = process.env.MONGO_DB;
let portMongo = process.env.MONGO_PORT;
let initDbMongo = process.env.MONGO_INITDB;
const apiPort = 8000;
exports.config = {
    mongoUrl: {
        url: process.env.MONGO_USER ? `mongodb://${userMongo}:${passwordMongo}@${hostMongo}:${portMongo}/` : 'mongodb://localhost/',
        db: process.env.MONGO_DB ? `${dbMongo}?authSource=${initDbMongo}` : `telega3` //docker
    },
    uploadPath: `${__dirname}/public/images`,
    imagePathFromApi: process.env.BACKEND_HOST ? `http://${baseUrlForBackend}:` + apiPort : 'http://localhost:' + apiPort,
    localApiUrl: process.env.BACKEND_HOST ? `http://${baseUrlForBackend}:` + apiPort : 'http://localhost:' + apiPort,
    telegramToken: "1688455909:AAG6JNSW5JfBA8Z5JrkS22EbnbJPuZk1SpI",
    // telegramToken: "1786540893:AAGlvXIiohO_NYDER4v5hft8r4aBvZwt0hc", //@TestingFrootBot
    // telegramToken: "1786540893:AAEVWiaoe1LUbx5hKZ6essSU8Wc75W1RgTg", //Default
    serverAdress: 'http://162.55.54.115:3000',
    telegramPort: 8001
};
