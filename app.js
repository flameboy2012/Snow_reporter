#!/usr/bin/env node
var config = require("./config");
var Bot = require("./bot");

var config = config.readConfig(process.env.CONFIG);

var bot = new Bot(config);

bot.registerJob("MorningCheck", "0 45 9 * * 1-5", () => bot.postPics("Soon", null));
bot.registerJob("LunchCheck", "0 0 13 * * 1-5", () => bot.postPics("Soon", null));
bot.registerJob("EveningCheck", "0 30 15 * * 1-5", () => bot.postPics("Soon", null));

bot.startBot();

console.log("Bot Started");