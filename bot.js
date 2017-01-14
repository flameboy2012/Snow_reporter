
var SlackBot = require("slackbots");
var request = require("request");
var Forecast = require("./models");


function Bot(config) {
    this.config = config;

    this.slack = new SlackBot({
        token: this.config.SlackToken,
        name: this.config.Name
    });
}

Bot.prototype.startBot = function() {
    this.slack.on("start", function() {
      sendHello(this);

      setInterval(() => wakeUp(this), this.config.ReportInterval);
    });
};

Bot.prototype.stopBot = function() {
  sendGoodbye(this);
};

function sendHello(bot) {

  bot.slack.postMessageToChannel("general", "Hello! Snow is back baby!", bot.config.SlackParams);

}

function sendGoodbye(bot) {

}

function wakeUp(bot) {

  var forecast = bot.lastForecast;

  request("http://www.myweather2.com/developer/weather.ashx?uac=J8AGqmQdGv&uref=697ed4ad-377c-4122-84af-4fa0ddae8dac&output=json", function (err, res, body) {
    if (err)
      console.log(err);

    var report = JSON.parse(body);

    if (forecast === null) {
      forecast = new Forecast(report.weather.snow_report[0]);
      bot.slack.postMessageToChannel("general", forecast.print(), params);
    } else {
      if (forecast.compare(report.weather.snow_report[0])) {
        forecast = new Forecast(report.weather.snow_report[0]);
        bot.postMessageToChannel("general", forecast.print(), params);
      }
    }

    bot.lastForecast = forecast;
  });
}



module.exports = Bot;