#!/usr/bin/env node
var SlackBot = require("slackbots");
var request = require("request");
var config = require("./config");
var Bot = require("./bot");

var config = config.readConfig(process.env.CONFIG);

var bot = new Bot(config);

bot.startBot();