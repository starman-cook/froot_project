const {  Telegraf }=require('telegraf');
// const session = require('telegraf/src/session');
// const WizardScene = require('telegraf/src/scenes/wizard/context');
// const Scene = require('telegraf/scenes/base');
// const Markup = require('telegraf/markup');
// const Stage = require('telegraf/stage');
// const {enter , leave} = Stage;





const axios=require('axios');
const express=require('express');
const cors=require('cors');
const port=8001;

const app=express();

app.use(cors());
app.use(express.json());



const token='1684002017:AAFEW70j_eq8PhfVrLWTdBbaVdujKCFpH3g';
// let interval;

const baseUrl='http://localhost:8000';


// const loginScene=new Scene('login',ctx=>{

// })



// const loginScene = new  WizardScene (
//     'login',
//     () => {
//          bot.on('text',async (ctx)=>{
//                 user.login=ctx.message.text;
//                 console.log('user ',user);

//                 return ctx.wizard.next();
//             });
        
//     },
//     () => {
//         bot.on('text',async (ctx)=>{
//             user.password=ctx.message.text;
//             console.log('user ',user);

//             return ctx.wizard.next();
//         });
        
//     });
//     const stage = new Stage([loginScene]);



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
    // bot.startWebhook('/telegram', null, 8000)

    // require('http')
    // .createServer(bot.webhookCallback('/telegram'))
    // .listen(8000)
let chatId;
   app.post('/telegram',(req,res)=>{
                // console.log(req)
                payment = req.body
                // res.send({message: "success"})
                let message='Новый платеж!\n';

            // payments.map((item)=>{
                
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
                    const link=('http://localhost:8000/uploads/'+payment.image);
                    message+=link +'\n';
                }
                message+='------------------------------------------';
                bot.telegram.sendMessage('-532910571',message);
               
            })



let user={
    chatId:'',
    workEmail:'',
    password:''
}




bot.command('start_notification',async (ctx)=>{
    let userInput=false;
    // interval= setInterval(async ()=>{
        try{
           await ctx.reply('Введите Ваш логин и пароль через пробел с сайта Froot.kz');

            chatId=await ctx.getChat();

            user.chatId=chatId.id;

            console.log('user ',user);

            bot.command('retry',async (ctx)=>{
                userInput=false;
                const resp= await axios.post('http://localhost:8000/users/telegram_sessions_stop',{chatId:chatId.id});
                        if(resp.data.message){

                            ctx.reply('Введите Ваш логин и пароль через пробел с сайта Froot.kz');
                        }
                        else{
                            ctx.reply('Неверный ввод!');
                        }
                ctx.reply('Пробуйте авторизоваться снова');
            })
            
            bot.on('text',async (ctx)=>{
                
              if(!userInput){
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
                        const resp= await axios.post('http://localhost:8000/users/telegram_sessions',user);
                        if(resp.data.message){

                            userInput=true;

                            ctx.reply('Request success!');
                        }
                        else{
                            ctx.reply('Неверный ввод!');
                        }
                        
                    }
              }
          
            });

            

            // bot.hears('login',ctx=>{
            //     // bot.on('message',ctx=>{
            //     //     const text=ctx.message.text;
            //     //     user.login=text;
            //     //     console.log('user login',user);
            //     //     ctx.reply('Ok');
            //     // })
            //     ctx.reply('login');

            // })
            // bot.hears('pass',ctx=>{
            //     // bot.on('message',ctx=>{
            //     //     const text=ctx.message.text;
            //     //     user.password=text;
            //     //     console.log('user pass',user);
            //     //     ctx.reply('Ok');
            //     // })
            //     ctx.reply('pass')
            // })

            
            
            
            


            // const resp=await axios.get(baseUrl+'/payments');
            // app.post('/telegram',(req,res)=>{
            //     // console.log(req)
            //     ctx.reply('new message!1');
            //     // res.send({message: "success"})
            // })
            // const payments=resp.data;
            // let message='Новый платеж!\n';

            // // payments.map((item)=>{
                
            //     message+=(payment.paided? 'оплачен ' : 'не оплачен '+'\n');
            //     message+=( payment.repeatability? 'повторяющийся ' : 'не повторяющийся '+'\n');
            //     message+=('назначение : '+ payment.appointment+'\n');
            //     message+=('плательщик : '+ payment.payer+'\n');
            //     message+=('счет : '+ payment.invoice+'\n');
            //     message+=('сумма : '+ payment.sum+'\n');
            //     message+=('дата платежа : '+ payment.dateOfPayment+'\n');
            //     message+=('подядчик : '+ payment.contractor+'\n');
            //     message+=('приоритет : '+ payment.priority+'\n');
            //     if(payment.image && payment.image!==''){
            //         const link=('http://localhost:8000/uploads/'+payment.image);
            //         message+=link +'\n';
            //     }
            //     message+='------------------------------------------';
            //     ctx.reply(message);

                // message='Новый платеж!\n';
                
            // });
            
        }
        catch(e){
            ctx.reply('Что то пошло не так!');
        }
    // },10000);
});

bot.command('stop_notification',async (ctx)=>{
    // clearInterval(interval);
    // ctx.reply('Уведомления приостановлены!');

    // ctx.reply('Введите Ваш пароль с сайта Froot.kz');
    //         bot.on('text',async (ctx)=>{
    //             user.password=ctx.message.text;
    //             console.log('user ',user);
    //         });
});


app.listen(port,()=>{
    console.log('port ',port);
});

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

