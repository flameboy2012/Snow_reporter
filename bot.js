
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

function sendHello() {

  this.slack.postMessageToChannel("general", "Hello! Snow is back baby!", this.config.SlackParams);

}

function sendGoodbye() {

}

function wakeUp() {

  var self = this;
  var forecast = self.lastForecast;

  request("http://www.myweather2.com/developer/weather.ashx?uac=J8AGqmQdGv&uref=697ed4ad-377c-4122-84af-4fa0ddae8dac&output=json", function (err, res, body) {
    if (err)
      console.log(err);

    var report = JSON.parse(body);

    if (forecast === null) {
      forecast = new Forecast(report.weather.snow_report[0]);
      self.slack.postMessageToChannel("general", forecast.print(), params);
    } else {
      if (forecast.compare(report.weather.snow_report[0])) {
        forecast = new Forecast(report.weather.snow_report[0]);
        self.slack.postMessageToChannel("general", forecast.print(), params);
      }
    }

    self.lastForecast = forecast;
  });
}

Bot.prototype.startBot = function() {
  console.log("Starting internal slack bot");
  console.log("%v", this);
  console.log("%v", this.slack);

  var self = this; //you... YOU..

  this.slack.on("start", function() {
    console.log("%v", this);
    console.log("%v", self);
    console.log("Sending hello message");
    self.slack.postMessageToChannel("general", "Hello! Snow is back baby!", self.config.SlackParams);

    setInterval(() => wakeUp.call(self), self.config.ReportInterval);
  });
};
Bot.prototype.stopBot = function() {

};

module.exports = Bot;