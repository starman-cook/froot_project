const path = require('path');
const rootPath = __dirname;
const log4js = require("log4js");


let user = process.env.MONGO_USER
let password = process.env.MONGO_PASS
let host = process.env.MONGO_HOST
let dbMongo = process.env.MONGO_DB
let port = process.env.MONGO_PORT
let initDb = process.env.MONGO_INITDB;
module.exports = {
    rootPath,
    uploadPath: path.join(rootPath, '../public/uploads'),
    db: {
        name: process.env.MONGO_DB ? `${dbMongo}?authSource=${initDb}` : 'froot',

        url:process.env.MONGO_USER ? `mongodb://${user}:${password}@${host}:${port}` : 'mongodb://localhost',
    },
    baseUrlForTelegram: process.env.BOT_HOST? 'http://'+process.env.BOT_HOST : 'http://localhost',
    log4jsApi:log4js.configure({
        appenders: { api: { type: "file", filename: "./logs/api.log" } },
        categories: { default: { appenders: ["api"], level: "error" } }
      })
};

