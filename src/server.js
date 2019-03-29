import express from 'express';
import { Bot } from './bot';
import { errorHandleAsync } from './helper';

const timeout = require('connect-timeout');
const app = express();
app.use(timeout(60000));
const bot = new Bot(process.env.WEBHOOK_URL);

app.get('/slack/github-trend', async function(_req, res) {
  const languages = process.env.GITHUB_LANGUAGES.split('|');
  await errorHandleAsync(() => bot.sayGithubTrend(languages));
  console.log('finished github-trend');
  res.status(200).end();
});

app.get('/slack/weather', async function(_req, res) {
  const yokohama = '140010';
  await errorHandleAsync(() => bot.sayWeather(yokohama));
  console.log('finished weather');
  res.status(200).end();
});

app.get('/slack/oreilly', async function(_req, res) {
  await errorHandleAsync(() => bot.sayOreilly());
  console.log('finished oreilly');
  res.status(200).end();
});

app.get('/ping', (_req, res) => res.status(200).send('pong').end());

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});