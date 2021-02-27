const { Telegraf } = require('telegraf');
// const axios=require('axios');

const token='1684002017:AAFEW70j_eq8PhfVrLWTdBbaVdujKCFpH3g';
let interval;

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
    interval= setInterval(()=>{
        ctx.reply('Новое уведомление!');
    },10000);
});

bot.command('stop_notification', ctx=>{
    clearInterval(interval);
    ctx.reply('Уведомления приостановлены!');
});



// bot.help( async (ctx) => {
    // const resp=await axios.get('');
//     ctx.reply(resp.data);
// });





bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));