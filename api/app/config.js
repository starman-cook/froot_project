const { url } = require('inspector');
const path = require('path');
const rootPath = __dirname;
const log4js = require("log4js");


//docker
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
        // name: 'froot',
        // name: 'test',
        // name:`${dbMongo}?authSource=${initDb}`,  //docker
        name: process.env.MONGO_DB ? `${dbMongo}?authSource=${initDb}` : 'froot',

        // url: 'mongodb://localhost',
        // url: 'mongodb+srv://QWE123:QWE123@cluster0.rrd3k.mongodb.net', // Pasha's mongo address !!
        // url:`mongodb://${user}:${password}@${host}:${port}`,  //docker
        url:process.env.MONGO_USER ? `mongodb://${user}:${password}@${host}:${port}` : 'mongodb://localhost',
        // url: 'mongodb://104.248.198.29',
    },
    //11 baseUrlForTelegram: 'http://'+process.env.BOT_HOST,  //docker
    baseUrlForTelegram: process.env.BOT_HOST? 'http://'+process.env.BOT_HOST : 'http://localhost',
    log4jsApi:log4js.configure({
        appenders: { api: { type: "file", filename: "~/logs/api.log" } },
        categories: { default: { appenders: ["api"], level: "error" } }
      })
};

