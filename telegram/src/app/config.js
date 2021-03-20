"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
var baseUrlForBackend = process.env.BACKEND_HOST;
var userMongo = process.env.MONGO_USER;
var passwordMongo = process.env.MONGO_PASS;
var hostMongo = process.env.MONGO_HOST;
var dbMongo = process.env.MONGO_DB;
var portMongo = process.env.MONGO_PORT;
var initDbMongo = process.env.MONGO_INITDB;
var apiPort = 8000;
exports.config = {
    mongoUrl: {
        // url: "mongodb+srv://QWE123:QWE123@cluster0.rrd3k.mongodb.net/",
        url: "mongodb://" + userMongo + ":" + passwordMongo + "@" + hostMongo + ":" + portMongo + "/",
        bd: dbMongo + "?authSource=" + initDbMongo
    },
    uploadPath: __dirname + "/public/images",
    // localApiUrl: "http://localhost:" + apiPort,
    localApiUrl: "http://" + baseUrlForBackend + ":" + apiPort,
    // publicApiUrl: "http://116.203.78.155:" + apiPort,
    telegramToken: "1688455909:AAG6JNSW5JfBA8Z5JrkS22EbnbJPuZk1SpI",
    // directorToken: "ZA9XhgRIZ_dXGoRHActC1",
    telegramPort: 8001
};
