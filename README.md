# slack-bot [![Build Status](https://travis-ci.org/monmaru/slack-bot.svg?branch=master)](https://travis-ci.org/monmaru/slack-bot)

## Install
1. clone this repository
2. npm Install

## Run
```
token=YOUR_API_TOKEN node bot.js
```

## Deploy on Heroku
Create application.
```
heroku create APP_NAME
```
Push to Heroku
```
git push heroku master
```
Please set the environment variable.
```
heroku config:add token=YOUR_API_TOKEN
```
