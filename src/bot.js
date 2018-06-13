import Slack from 'slack-node';
import Trend from './github';
import Weather from './weather';
import Oreilly from './oreilly';

export default class Bot {

  constructor(webhookUrl, slack = new Slack()) {
    this.LF = '\n';
    this.webhookUrl = webhookUrl;
    this.slack = slack;
  }

  sayGithubTrend() {
    const trend = new Trend();
    const languages = ['C#', 'Go', 'Python', 'Kotlin'];
    languages.forEach((lang) => {
      trend.fetch(lang).then((repos) => {
        const attachments = Array.from(repos).map((repo) => {
          return {
            'fallback': repo.url,
            'title': repo.title,
            'title_link': repo.url,
            'text': `${repo.description}${this.LF}${repo.star}`,
            'color': '#F35A00'
          };
        });
        
        this.slack.setWebhook(this.webhookUrl);
        this.slack.webhook({
          'channel': '#github',
          'username': 'github_bot',
          'text': `Trending in ${lang}`,
          'icon_emoji': ':moyai:',
          'attachments': attachments
        }, (err, response) => {
          if (err !== null || response.statusCode !== 200) {
            console.log(err);
            console.log(response);
          }
        });
      }).catch((err) => console.log(err));
    });
  }

  sayWeather() {
    const weather = new Weather();
    const yokohama = '140010';
    weather.fetch(yokohama).then((result) => {
      const attachments = Array.from(result.forecasts)
        .filter((f) => (f.temperature.min !== null) && (f.temperature.max !== null))
        .map((f) => {
          const min = f.temperature.min == null ? '' : f.temperature.min.celsius;
          const max = f.temperature.max == null ? '' : f.temperature.max.celsius;
          return {
            'fallback': f.telop,
            'title': f.telop,
            'text': `${f.date}${this.LF}最低気温 ${min}${this.LF}最高気温 ${max}`,
            'image_url': f.image.url,
            'color': '#307EB8'
          };
        });

      this.slack.setWebhook(this.webhookUrl);
      this.slack.webhook({
        'channel': '#general',
        'username': 'weather_bot',
        'text': result.title,
        'icon_emoji': ':earth_asia:',
        'attachments': attachments
      }, (err, response) => {
        if (err !== null || response.statusCode !== 200) {
          console.log(err);
          console.log(response);
        }
      });
    }).catch((err) => console.log(err));
  }

  sayOreilly() {
    const oreilly = new Oreilly();
    return Promise.resolve()
      .then(() => oreilly.fetchBookCatalog())
      .then((books) => {
        const attachments = books.map((book) => {
          return {
            'fallback': book.title,
            'title': book.title,
            'title_link': book.link,
            'text': `${book.creator}${this.LF}updated at ${book.date}`,
            'image_url': book.imageUrl,
            'color': '#C71337'
          };
        });
       
        this.slack.setWebhook(this.webhookUrl);
        this.slack.webhook({
          'channel': '#general',
          'username': 'oreilly_bot',
          'text': 'OReilly Japan New & Upcomming',
          'icon_emoji': ':books:',
          'attachments': attachments
        }, (err, response) => {
          if (err !== null || response.statusCode !== 200) {
            console.log(err);
            console.log(response);
          }
        });
      })
      .then(() => oreilly.fetchNewEBooks())
      .then((ebooks) => {
        const attachments = ebooks.map((ebook) => {
          return {
            'fallback': ebook.title,
            'title': ebook.title,
            'title_link': ebook.link,
            'text': `updated at ${ebook.updated}`,
            'image_url': ebook.imageUrl,
            'color': '#C71337'
          };
        });
        this.slack.setWebhook(this.webhookUrl);
        this.slack.webhook({
          'channel': '#general',
          'username': 'oreilly_bot',
          'text': 'Ebook Store - New Release',
          'icon_emoji': ':books:',
          'attachments': attachments
        }, (err, response) => {
          if (err !== null || response.statusCode !== 200) {
            console.log(err);
            console.log(response);
          }
        });
      })
      .catch((err) => console.log(err));
  }
}
