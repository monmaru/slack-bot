import express from 'express';
import { errorHandleAsync } from './helper';
import { Bot } from './bot';

const app = express();
const bot = new Bot(process.env.WEBHOOK_URL);

app.get('/slack/github-trend', async function(_req, res) {
  await errorHandleAsync(() => bot.sayGithubTrend());
  console.log('finished github-trend');
  res.status(200).end();
});

app.get('/slack/weather', async function(_req, res) {
  await errorHandleAsync(() => bot.sayWeather());
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