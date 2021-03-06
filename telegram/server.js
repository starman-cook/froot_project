const {  Telegraf }=require('telegraf');
const axios=require('axios');
const express=require('express');
const mongoose = require('mongoose');
const cors=require('cors');
const port=8001;
const config=require('./config');

const app=express();

app.use(cors());
app.use(express.json());

const User=require('./models/User');



const token='1684002017:AAFEW70j_eq8PhfVrLWTdBbaVdujKCFpH3g';
// let interval;

const baseUrl='http://localhost:8000';



const bot = new Telegraf(token);
bot.use(Telegraf.log());


bot.start((ctx) => {
    ctx.reply('Привет! Чтобы получать уведомления введи команду /start_notification \n Для получения инструкций введи команду /help');
});
bot.help(async (ctx) => {
    const comands=await bot.telegram.getMyCommands();
    let message='';
    comands.forEach(item=>{
        message+=`/${item.command} - ${item.description}\n`;
    });
    ctx.reply(message);
});
let payment = {};
  
let chatId;

    
    // mongoose.connect(config.db.url+':'+port+'/'+config.db.name, {
    //     useNewUrlParser:true, 
    //     useUnifiedTopology: true
    // });
    // mongoose.disconnect();

   app.post('/telegram', async (req,res)=>{
                payment = req.body;

                if(payment.priority==='Срочный'){
                    let message='Новый платеж!\n';

                
                    message+=(payment.paided? 'оплачен ' : 'не оплачен '+'\n');
                    message+=( payment.repeatability? 'повторяющийся ' : 'не повторяющийся '+'\n');
                    message+=('назначение : '+ payment.appointment+'\n');
                    message+=('плательщик : '+ payment.payer+'\n');
                    message+=('счет : '+ payment.invoice+'\n');
                    message+=('сумма : '+ payment.sum+'\n');
                    message+=('дата платежа : '+ payment.dateOfPayment+'\n');
                    message+=('подядчик : '+ payment.contractor+'\n');
                    message+=('приоритет : '+ payment.priority+'\n');
                    if(payment.image && payment.image!==''){
                        const link=(baseUrl+'/uploads/'+payment.image);
                        message+=link +'\n';
                    }
                    message+='------------------------------------------';


                    mongoose.connect(config.db.url+'/'+config.db.name, {
                        useNewUrlParser:true, 
                        useUnifiedTopology: true
                    });

                    const directorList= await User.find({role:'director'});

                    directorList.map(item=>{
                        bot.telegram.sendMessage(item.chatId,message);
                    })
                    res.send({message:"ok"});
                    
                    mongoose.disconnect();

                    // payment.chatId=['-532910571','1052153386'];
                }
                
               
            });

            
    
    bot.command('stop_notification',async (ctx)=>{
        mongoose.connect(config.db.url+'/'+config.db.name, {
            useNewUrlParser:true, 
            useUnifiedTopology: true
        });

        chatId=await ctx.getChat();

        const newUser= await User.findOne({chatId:chatId.id});
        if(!newUser){
            ctx.reply('Данный пользователь не авторизирован Froot.kz , для авторизации введите /start_notification');
        }
        else{
            await User.findOneAndDelete({chatId:chatId.id});
            ctx.reply('Данный пользователь удален, для авторизации введите /start_notification');
        }

        mongoose.disconnect();
    });

bot.command('start_notification',async (ctx)=>{
    let user={
        chatId:'',
        workEmail:'',
        password:''
    }

        try{
            mongoose.connect(config.db.url+'/'+config.db.name, {
                useNewUrlParser:true, 
                useUnifiedTopology: true
            });
    
            chatId=await ctx.getChat();
    
            const newUser= await User.findOne({chatId:chatId.id});
            mongoose.disconnect();
            
            if(!newUser){
                await ctx.reply('Введите Ваш логин и пароль через пробел с сайта Froot.kz');
           

                bot.command('retry',async (ctx)=>{
                    // userInput=false;
                    
    
                    // const resp= await axios.post((baseUrl+'/users/telegram_sessions_stop'),{chatId:chatId.id});
                    //         if(resp.data.message){
    
                    //             ctx.reply('Введите Ваш логин и пароль через пробел с сайта Froot.kz');
                    //         }
                    //         else{
                    //             ctx.reply('Неверный ввод!');
                    //         }
                    // ctx.reply('Пробуйте авторизоваться снова');
                })
                
                bot.on('text',async (ctx)=>{
                    chatId=await ctx.getChat();
                // console.log(chatId);
                
                
                
                user.chatId=chatId.id;
    
                // console.log('user ',user);
    
                //   if(!userInput){
                            // const text=ctx.message.text;
                        // userInput+=text+' ';
                        const text=ctx.message.text.split(' ');
                        user.workEmail=text[0];
                        user.password=text[1];
                        
                        
                        await ctx.reply('Ok');
                        // let regular = /\w+/g; 
                        // let result = userInput.match(regular);
                        // user.login=result[0];
                        // user.password=result[1];
    
    
                        // console.log(userInput)
                        console.log('user ',user);
    
                        if(user.password!==''){
                            
    
                            const resp= await axios.post(baseUrl+'/users/telegram_sessions',user);
                            if(resp.data.user){
    
                                mongoose.connect(config.db.url+'/'+config.db.name, {
                                    useNewUrlParser:true, 
                                    useUnifiedTopology: true
                                });
    
                                const newUser= new User({
                                    chatId:resp.data.user.chatId,
                                    workEmail:user.workEmail,
                                    role:resp.data.user.role
                                    
                                });
                                await newUser.save();
    
                                mongoose.disconnect();
    
                                ctx.reply('Request success!');
                            }
                            else{
                                ctx.reply('Неверный ввод!');
                            }
                            
                        }
                });
            }
            else{
                ctx.reply('Данный пользователь уже зарегистрирован, для перерегистрации введите /stop_notification');
            }
          
        }
        catch(e){
            ctx.reply('Что то пошло не так!');
        }
});



app.listen(port, () => {
    console.log(`Server started on port ${port}!`)
});
console.log('Mongoose connected!');





bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

