

// let baseUrlForBackend=process.env.BACKEND_HOST;
//
// let userMongo = process.env.MONGO_USER
// let passwordMongo= process.env.MONGO_PASS
// let hostMongo = process.env.MONGO_HOST
// let dbMongo = process.env.MONGO_DB
// let portMongo = process.env.MONGO_PORT
// let initDbMongo = process.env.MONGO_INITDB;



const apiPort = 8000

export const config = {
    mongoUrl: {
        url: "mongodb+srv://QWE123:QWE123@cluster0.rrd3k.mongodb.net/",
        // url: `mongodb://${userMongo}:${passwordMongo}@${hostMongo}:${portMongo}/`,
        // bd: `${dbMongo}?authSource=${initDbMongo}`
        db: `telega3`
    },
    uploadPath: `${__dirname}/public/images`,
    localApiUrl: "http://localhost:" + apiPort,
    imagePathFromApi: 'http://localhost:' + apiPort,
    // localApiUrl: `http://${baseUrlForBackend}:` + apiPort,
    // publicApiUrl: "http://116.203.78.155:" + apiPort,
    telegramToken: "1688455909:AAG6JNSW5JfBA8Z5JrkS22EbnbJPuZk1SpI",
    // directorToken: "ZA9XhgRIZ_dXGoRHActC1",
    telegramPort: 8001
}