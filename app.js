#!/usr/bin/env node
var config = require("./config");
var Bot = require("./bot");

var config = config.readConfig(process.env.CONFIG);

var bot = new Bot(config);

bot.registerJob("MorningCheck", "0 45 9 3 2 1-5", () => bot.postPics("THE 5:30 HYPE SERVICE TO FUNSVILLE WILL ARRIVE ON PLATFORM MEMES", null));
bot.registerJob("HourlyPost",   "0 0 10-16 3 2 1-5", () => bot.postPics("Your hourly reminder you are still at work, and not here:", null));
bot.registerJob("LunchCheck",   "0 0 17 3 2 1-5", () => bot.postPics("LAST CALL FOR THE 5:30 HYPE SERVER TO FUNSVILLE ON PLATFORM MEMES", null));
bot.registerJob("EveningCheck", "0 30 17 3 2 1-5", () => bot.postPics("ITS OVER! ITS FINALLY OVER! THE HYPE SERVICE HAS LEFT THE STATION!", null));

bot.startBot();

console.log("Bot Started");