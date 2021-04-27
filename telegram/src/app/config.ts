

let baseUrlForBackend = process.env.BACKEND_HOST;

let userMongo = process.env.MONGO_USER
let passwordMongo = process.env.MONGO_PASS
let hostMongo = process.env.MONGO_HOST
let dbMongo = process.env.MONGO_DB
let portMongo = process.env.MONGO_PORT
let initDbMongo = process.env.MONGO_INITDB;



const apiPort = 8000

export const config = {
    mongoUrl: {
        // url: 'mongodb://localhost/', //Askar
        // url: "mongodb+srv://QWE123:QWE123@cluster0.rrd3k.mongodb.net/", //Default
        url: `mongodb://${userMongo}:${passwordMongo}@${hostMongo}:${portMongo}/`, //docker
        db: `${dbMongo}?authSource=${initDbMongo}` //docker
        // db: `telega3`
    },
    uploadPath: `${__dirname}/public/images`,
    // localApiUrl: "http://localhost:" + apiPort,
    // imagePathFromApi: 'http://localhost:' + apiPort,
    imagePathFromApi: `http://${baseUrlForBackend}:` + apiPort, //docker
    localApiUrl: `http://${baseUrlForBackend}:` + apiPort, //docker
    telegramToken: "1688455909:AAG6JNSW5JfBA8Z5JrkS22EbnbJPuZk1SpI", //@FrootNotify
    // telegramToken: "1786540893:AAGlvXIiohO_NYDER4v5hft8r4aBvZwt0hc", //@TestingFrootBot
    // telegramToken: "1786540893:AAEVWiaoe1LUbx5hKZ6essSU8Wc75W1RgTg", //Default
    // directorToken: "ZA9XhgRIZ_dXGoRHActC1",
    serverAdress: 'http://162.55.54.115:3000',
    telegramPort: 8001
}
