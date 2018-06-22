import express from 'express';
import Bot from './bot';

const app = express();
const bot = new Bot(process.env.WEBHOOK_URL);

app.get('/slack/github-trend', (_req, res) => {
  bot.sayGithubTrend();
  console.log('finished github-trend');
  res.status(200).end();
});

app.get('/slack/weather', (_req, res) => {
  bot.sayWeather();
  console.log('finished weather');
  res.status(200).end();
});

app.get('/slack/oreilly', (_req, res) => {
  bot.sayOreilly();
  console.log('finished oreilly');
  res.status(200).end();
});

app.get('/ping', (_req, res) => {
  res.status(200).send('pong').end();
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});