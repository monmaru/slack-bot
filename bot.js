var trending = require('github-trending');
var Botkit = require('botkit');
var CronJob = require('cron').CronJob;
var controller = Botkit.slackbot();
var bot = controller.spawn({
  token: process.env.token
}).startRTM(function(err, bot, payload) {
  if (err) {
    throw new Error('Could not connect to Slack');
  }
  
  new CronJob({
    cronTime: '00 00 16 * * 0-6',
    onTick: function() {
      ['C#', 'Python', 'Go'].forEach(function(lang) {
        trending(lang, function(err, repos) {
          if (err) {
            console.log(err);
            throw new Error('Could not acces to Github');
          }
          
          var attachments = []
          repos.forEach(function(repo) {
            var LF = '\n';
            attachments.push({
              'fallback': repo.url,
              'title': repo.title,
              "title_link": repo.url,
              'text': repo.description + LF + repo.star,
              'color': '#F35A00'
            });
          })

          bot.say({
            'channel': '#github',
            'username': 'github_bot',
            'text': 'Trending in ' + lang,
            'attachments': attachments,
            'icon_emoji': ':moyai:',
          });
        });
      })
    },
    start: true,
    timeZone: 'Asia/Tokyo'
  });
});

controller.hears(['こんにちわ'], ['direct_message', 'direct_mention', 'mention'], function(bot, message) {
  bot.reply(message, 'こんにちわ');
});