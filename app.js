#!/usr/bin/env node
var config = require("./config");
var Bot = require("./bot");

var config = config.readConfig(process.env.CONFIG);

var bot = new Bot(config);
bot.startBot();

console.log("Bot Started");