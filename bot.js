
var SlackBot = require("slackbots");
var request = require("request");
var Forecast = require("./models");


function Bot(config) {
    this.config = config;
    this.lastForecast = null;

    this.slack = new SlackBot({
        token: this.config.SlackToken,
        name: this.config.Name
    });
}

function sendHello() {

  this.slack.postMessageToChannel("general", "Hello! Snow is back baby!", this.config.SlackParams);

}

function sendGoodbye() {

}

function wakeUp() {

  var self = this;
  var forecast = self.lastForecast;

  console.log("Getting new snow report");
  request("http://www.myweather2.com/developer/weather.ashx?uac=J8AGqmQdGv&uref=697ed4ad-377c-4122-84af-4fa0ddae8dac&output=json", function (err, res, body) {
    if (err)
      console.log(err);

    var report = JSON.parse(body);

    if (forecast === null) {
      forecast = new Forecast(report.weather.snow_report[0]);
    } else if (forecast.compare(report.weather.snow_report[0])) {
        forecast = new Forecast(report.weather.snow_report[0]);
    } else {
      console.log("No new forecast");
      return;
    }
    console.log("Posting updated forecast");
    self.slack.postMessageToChannel("general", forecast.print(), self.config.SlackPostParams);

    self.lastForecast = forecast;
  });
}

Bot.prototype.startBot = function() {
  console.log("Starting internal slack bot");
  var self = this; //you... YOU..

  this.slack.on("start", function() {
    self.slack.postMessageToChannel("general", "Hello! Snow is back baby!", self.config.SlackPostParams);

    console.log("Sleeping for %d", self.config.ReportInterval);
    setInterval(wakeUp.call, self.config.ReportInterval, self);
  });
};
Bot.prototype.stopBot = function() {

};

module.exports = Bot;