const mongoose = require("mongoose");
const config = require("./config");
const User = require("./models/User");

mongoose.connect(config.db.url+'/'+config.db.name, {useNewUrlParser:true, useUnifiedTopology: true})
const db = mongoose.connection
db.once('open',async()=> {
    try{
        await db.dropCollection('users')
    }catch(e){
        console.log('Collection were not present, skipping drop...')
    }
    
        
    await db.close()
})