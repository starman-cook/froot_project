const {  Telegraf }=require('telegraf');
const { Router, Markup } = Telegraf;
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

    // payment.chatId=['-532910571','1052153386'];

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

                    const keyboardAnswer=[['/confirm','/change_date']];

                    directorList.map(item=>{
                        bot.telegram.sendMessage(item.chatId,message,{reply_markup:{keyboard:keyboardAnswer}});
                    });
                    res.send({message:"ok"});
                    
                    mongoose.disconnect();

                    bot.command('confirm',async (ctx)=>{
                        chatId=await ctx.getChat();

                        if(chatId.type==='private' && payment._id!==''){
                            const resp= await axios.post(baseUrl+'/payments/telegram/'+payment._id+'/paid');
                            
                            if(resp.data.message){
                                bot.telegram.sendMessage(chatId.id,'Платеж подтвержден!',{reply_markup:{remove_keyboard:true}});
                                payment._id='';
                            }
                            else{
                                ctx.reply('Что то пошло не так!');
                            }
                        }
                        else{
                            ctx.reply('Данная команда доступна только в личной переписке с ботом и только в случае поступления новой заявки!');
                        }
                        
                    });
                    bot.command('change_date',async (ctx)=>{
                        chatId=await ctx.getChat();
                        if(chatId.type==='private' && payment._id!==''){
                            const resp= await axios.post(baseUrl+'/payments/telegram/'+payment._id+'/date');
                            
                            if(resp.data.message){
                                bot.telegram.sendMessage(chatId.id,'Платеж перенесен на завтра!',{reply_markup:{remove_keyboard:true}});
                                payment._id='';
                            }
                            else{
                                ctx.reply('Что то пошло не так!');
                            }
                        }
                        else{
                            ctx.reply('Данная команда доступна только в личной переписке с ботом и только в случае поступления новой заявки!');
                        }
                    });
                }
            });
            
    bot.command('stop_notification',async (ctx)=>{
       
        chatId=await ctx.getChat();

        if(chatId.type==='private'){

            mongoose.connect(config.db.url+'/'+config.db.name, {
                useNewUrlParser:true, 
                useUnifiedTopology: true
            });
    
            const newUser= await User.findOne({chatId:chatId.id});
            if(!newUser){
                ctx.reply('Данный пользователь не авторизирован Froot.kz , для авторизации введите /start_notification');
            }
            else{
                await User.findOneAndDelete({chatId:chatId.id});
                ctx.reply('Данный пользователь удален, для авторизации введите /start_notification');
            }
    
            mongoose.disconnect();
        }
        else{
            ctx.reply('Авторизация доступна только в личной переписке с ботом!');
        }
    });

bot.command('start_notification',async (ctx)=>{

        try{
            chatId=await ctx.getChat();

            if(chatId.type==='private'){
                let user={
                    chatId:'',
                    workEmail:'',
                    password:''
                }
                mongoose.connect(config.db.url+'/'+config.db.name, {
                    useNewUrlParser:true, 
                    useUnifiedTopology: true
                });
        
                const newUser= await User.findOne({chatId:chatId.id});
                mongoose.disconnect();
                
                if(!newUser){
                    await ctx.reply('Введите Ваш логин и пароль через пробел одним сообщением с сайта Froot.kz');
    
                    bot.on('text',async (ctx)=>{
                        chatId=await ctx.getChat();
                    
                        user.chatId=chatId.id;
        
                            const text=ctx.message.text.split(' ');
                            user.workEmail=text[0];
                            user.password=text[1];
                            
                            await ctx.reply('Ok');
                            // console.log('user ',user);
        
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
            else{
                ctx.reply('Авторизация доступна только в личной переписке с ботом!');
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

