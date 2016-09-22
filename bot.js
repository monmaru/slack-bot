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
    cronTime: '00 00 19 * * 0-6',
    onTick: function() {
      trending('C#', function(err, repos) {
        if (err) {
          console.log(err);
          throw new Error('Could not acces to Github');
        }

        var LF = '\n';
        for(var i = 0; i < repos.length; i++) {
          var messageBody = '■' + repos[i].title + LF
                          + repos[i].url + LF
                          + repos[i].description + LF
                          + repos[i].star + LF
                          + '------------------------------------' + LF;
          bot.say({
            channel: 'general',
            text: messageBody,
            username: 'github_bot',
            icon_url: ''
          });
        }
      });
    },
    start: true,
    timeZone: 'Asia/Tokyo'
  });
});

controller.hears(["こんにちわ"], ["direct_message", "direct_mention", "mention"], function(bot, message) {
  bot.reply(message, 'こんにちわ');
});