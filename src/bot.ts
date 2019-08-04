import Slack from 'slack-node';
import { asyncForEach } from './helper';
import { TrendService } from './service/github';
import { OreillyService } from './service/oreilly';
import { WeatherService } from './service/weather';

const LF = '\n';

export class Bot {
  private readonly webhookUrl: string;

  private readonly slack: Slack;

  constructor(webhookUrl: string, slack = new Slack()) {
    this.webhookUrl = webhookUrl;
    this.slack = slack;
  }

  async sayGithubTrend(languages: string[]) {
    const service = new TrendService();
    asyncForEach(languages, async lang => {
      const repos = await service.fetch(lang);
      const attachments = Array.from(repos).map(repo => {
        return {
          fallback: repo.url,
          title: repo.title,
          title_link: repo.url,
          text: `${repo.description}${LF}${repo.star}`,
          color: '#F35A00',
        };
      });

      this.doWebhook({
        channel: '#github',
        username: 'github_bot',
        text: `Trending in ${lang}`,
        icon_emoji: ':moyai:',
        attachments: attachments,
      });
    });
  }

  async sayWeather(city: string) {
    const weather = new WeatherService();
    const result = await weather.fetch(city);
    const attachments = Array.from(result.forecasts)
      .filter(f => f.temperature.min !== null && f.temperature.max !== null)
      .map(f => {
        const min = f.temperature.min == null ? '' : f.temperature.min.celsius;
        const max = f.temperature.max == null ? '' : f.temperature.max.celsius;
        return {
          fallback: f.telop,
          title: f.telop,
          text: `${f.date}${LF}最低気温 ${min}${LF}最高気温 ${max}`,
          image_url: f.image.url,
          color: '#307EB8',
        };
      });

    this.doWebhook({
      channel: '#general',
      username: 'weather_bot',
      text: result.title,
      icon_emoji: ':earth_asia:',
      attachments: attachments,
    });
  }

  async sayOreilly() {
    const oreilly = new OreillyService();
    {
      const books = await oreilly.fetchBookCatalog();
      const attachments = books.map(book => {
        return {
          fallback: book.title,
          title: book.title,
          title_link: book.link,
          text: `${book.creator}${LF}updated at ${book.date}`,
          image_url: book.imageUrl,
          color: '#C71337',
        };
      });

      this.doWebhook({
        channel: '#general',
        username: 'oreilly_bot',
        text: 'OReilly Japan New & Upcomming',
        icon_emoji: ':books:',
        attachments: attachments,
      });
    }

    {
      const ebooks = await oreilly.fetchNewEBooks();
      const attachments = ebooks.map(ebook => {
        return {
          fallback: ebook.title,
          title: ebook.title,
          title_link: ebook.link,
          text: `updated at ${ebook.updated}`,
          image_url: ebook.imageUrl,
          color: '#C71337',
        };
      });

      this.doWebhook({
        channel: '#general',
        username: 'oreilly_bot',
        text: 'Ebook Store - New Release',
        icon_emoji: ':books:',
        attachments: attachments,
      });
    }
  }

  doWebhook(options: Slack.WebhookOptions) {
    this.slack.setWebhook(this.webhookUrl);
    this.slack.webhook(options, (err, response) => {
      if (err !== null || response.statusCode !== 200) {
        console.log(err);
        console.log(response);
      }
    });
  }
}
