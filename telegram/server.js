const { Telegraf } = require('telegraf');
const axios=require('axios');

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

bot.command('start_notification',async (ctx)=>{
    interval= setInterval(async ()=>{
        try{
            const resp=await axios.get(baseUrl+'/payments');
            const payments=resp.data;
            let message='Новый платеж!\n';

            payments.map((item)=>{
                
                message+=(item.paided? 'оплачен ' : 'не оплачен '+'\n');
                message+=( item.repeatability? 'повторяющийся ' : 'не повторяющийся '+'\n');
                message+=('назначение : '+ item.appointment+'\n');
                message+=('плательщик : '+ item.payer+'\n');
                message+=('счет : '+ item.invoice+'\n');
                message+=('сумма : '+ item.sum+'\n');
                message+=('дата платежа : '+ item.dateOfPayment+'\n');
                message+=('подядчик : '+ item.contractor+'\n');
                message+=('приоритет : '+ item.priority+'\n');
                if(item.image && item.image!==''){
                    const link=('http://localhost:8000/uploads/'+item.image);
                    message+=link +'\n';
                }
                message+='------------------------------------------';
                ctx.reply(message);

                message='Новый платеж!\n';
                
            });
            
        }
        catch(e){
            ctx.reply('Что то пошло не так!');
        }
    },10000);
});

bot.command('stop_notification', ctx=>{
    clearInterval(interval);
    ctx.reply('Уведомления приостановлены!');
});




bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));