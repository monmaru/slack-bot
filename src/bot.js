import Botkit from 'botkit';
import cron from 'cron';
import Trend from './github';
import Weather from './weather';

const CronJob = cron.CronJob;
const controller = Botkit.slackbot();
const LF = '\n';

const bot = controller.spawn({ token: process.env.token }).startRTM((err) => {
  if (err) {
    throw new Error('Could not connect to Slack');
  }

  const tz = 'Asia/Tokyo';
  
  new CronJob({
    cronTime: '00 00 18 * * 0-6',
    onTick: sayGithubTrend,
    start: true,
    timeZone: tz
  });

  new CronJob({
    cronTime: '00 00 20 * * 0-6',
    onTick: sayWeather,
    start: true,
    timeZone: tz
  });
  
});

const sayGithubTrend = () => {
  const trend = new Trend();
  const languages = ['C#', 'Go', 'Python', 'Rust'];
  languages.forEach((lang) => {
    trend.fetch(lang).then((repos) => {
      const attachments = Array.from(repos).map((repo) => {
        return {
          'fallback': repo.url,
          'title': repo.title,
          'title_link': repo.url,
          'text': `${repo.description}${LF}${repo.star}`,
          'color': '#F35A00'
        };
      });
      
      bot.say({
        'channel': '#github',
        'username': 'github_bot',
        'text': `Trending in ${lang}`,
        'attachments': attachments,
        'icon_emoji': ':moyai:'
      });
    }).catch((err) => console.log(err));
  });
};

const sayWeather = () => {
  const weather = new Weather();
  const yokohama = '140010';
  weather.fetch(yokohama).then((result) => {
    const attachments = Array.from(result.forecasts).map((f) => {
      const min = f.temperature.min == null ? '' : f.temperature.min.celsius;
      const max = f.temperature.max == null ? '' : f.temperature.max.celsius;

      return {
        'fallback': f.telop,
        'title': f.telop,
        'text': `${f.date}${LF}最低気温 ${min}${LF}最高気温 ${max}`,
        'image_url': f.image.url,
        'color': '#307EB8'
      };
    });
   
    bot.say({
      'channel': '#general',
      'username': 'weather_bot',
      'text': result.title,
      'attachments': attachments,
      'icon_emoji': ':earth_asia:'
    });
  }).catch((err) => console.log(err));
};