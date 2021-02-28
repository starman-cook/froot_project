const { Telegraf } = require('telegraf');
const axios=require('axios');
const express=require('express');
const cors=require('cors');
const port=8001;

const app=express();

app.use(cors());
app.use(express.json());


const token='1684002017:AAFEW70j_eq8PhfVrLWTdBbaVdujKCFpH3g';
let interval;

const baseUrl='http://localhost:8000';

const bot = new Telegraf(token);
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

   app.post('/telegram',(req,res)=>{
                // console.log(req)
                payment = req.body
                // res.send({message: "success"})
            })


bot.command('start_notification',async (ctx)=>{
    // interval= setInterval(async ()=>{
        try{

            // const resp=await axios.get(baseUrl+'/payments');
            // app.post('/telegram',(req,res)=>{
            //     // console.log(req)
            //     ctx.reply('new message!1');
            //     // res.send({message: "success"})
            // })
            // const payments=resp.data;
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
                ctx.reply(message);

                // message='Новый платеж!\n';
                
            // });
            
        }
        catch(e){
            ctx.reply('Что то пошло не так!');
        }
    // },10000);
});

// bot.command('stop_notification', ctx=>{
//     clearInterval(interval);
//     ctx.reply('Уведомления приостановлены!');
// });


app.listen(port,()=>{
    console.log('port ',port);
});

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

