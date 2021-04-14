const mongoose = require('mongoose');
const config=require('./config');
mongoose.Promise = global.Promise;
const User=require('../app/models/User');

module.exports={
    mongoConnect:function connect(){
        return new Promise((resolve, reject) => {
            if(process.env.NODE_ENV==='test') {
                let Mockgoose = require('mockgoose').Mockgoose;
                let mockgoose = new Mockgoose(mongoose);
                mockgoose.prepareStorage().then(function() {
                    mongoose.connect(config.db.url + '/' + config.db.name, (err, res) => {
                      if (err) return reject(err);
                      resolve();
                      console.log('Mockgoose connected!');
                    });
                }).catch(reject);
            }else{
                mongoose.connect(config.db.url + '/' + config.db.name, (err, res) => {
                  if (err) return reject(err);
                  resolve();
                  console.log('Mongoose connected!');
                });
            }
            
        })
        
    },

    mongoDisconnect: function close(){
        return mongoose.disconnect();
    }
}