require('dotenv').config();
const { Telegraf } = require('telegraf');
const api = require('covid19-api');
const Markup = require('telegraf/markup');
const COUNTRY_LIST = require('./constant');
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply(
    `
Привет ${ctx.message.from.first_name}! 
Введи на английском название 
страны или команду /world для получения статистики 
по короновирусу 🦠.
Все страны доступны по 
команде /help.
`,
    Markup.keyboard([
      ['Russia', 'Belarus'],
      ['Ukraine', 'Kazakhstan'],
      ['US', 'UK'],
    ])
      .resize()
      .extra()
  );
});
bot.hears('Привет', (ctx) => ctx.reply('Привет, можешь посмотреть статистику по Covid19'));
bot.help((ctx) => ctx.reply(COUNTRY_LIST));

bot.on('text', async (ctx) => {
  let data = {};
  let country;
  try {
    if (ctx.message.text == '/world') {
      data = await api.getReports();
      country = 'World';
    } else {
      data = await api.getReportsByCountries(ctx.message.text);
      country = data[0][0].country;
    }
    const formatData = `
${country}
Заболевших: ${data[0][0].cases}
Умерших: ${data[0][0].deaths}
Вылечились: ${data[0][0].recovered}
  `;
    ctx.reply(formatData);
  } catch {
    ctx.reply('Такая страна не найдена');
  }
});

bot.launch();
console.log('Бот запущен');
