import Botkit from 'botkit';
import cron from 'cron';
import Trend from './github';

const CronJob = cron.CronJob;
const controller = Botkit.slackbot();

controller.spawn({ token: process.env.token }).startRTM((err, bot) => {
  if (err) {
    throw new Error('Could not connect to Slack');
  }
  
  new CronJob({
    cronTime: '00 00 18 * * 0-6',
    onTick: () => {
      const trend = new Trend();
      ['C#', 'Python', 'Go'].forEach((lang) => {
        trend.fetch(lang).then((repos) => {
          const attachments = Array.from(repos).map((repo) => {
            return {
              'fallback': repo.url,
              'title': repo.title,
              'title_link': repo.url,
              'text': repo.description + '\n' + repo.star,
              'color': '#F35A00'
            };
          });
          
          bot.say({
            'channel': '#github',
            'username': 'github_bot',
            'text': 'Trending in ' + lang,
            'attachments': attachments,
            'icon_emoji': ':moyai:'
          });
        }).catch((err) => console.log(err));
      });
    },
    start: true,
    timeZone: 'Asia/Tokyo'
  });
});

controller.hears(['こんにちわ'], ['direct_message', 'direct_mention', 'mention'], (bot, message) => bot.reply(message, 'こんにちわ'));