
var SlackBot = require("slackbots");
var request = require("request");
// var node_schedule = require("node-schedule");
var CronJob = require('cron').CronJob;
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
    if (err) {
      console.log(err);
      return;
    }

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
    postMessage.call(self, "Look what just got updated!\n" + forecast.print());

    self.lastForecast = forecast;
  });
}

function postPics(message) {
  postMessage.call(this, message + "\nhttps://static1.merinet.com/image_uploader/webcam/large/meribel-panoramic-webcam.jpg");
}

function postMessage(message) {
  this.slack.postMessageToChannel(this.config.SlackChannel, message, this.config.SlackPostParams);
}

function handleMessage(data) {
  if (data.type != "desktop_notification")
    return;
  console.log("Recieved message");
  if (data.content.toLowerCase().indexOf("weather") > -1) {
    console.log("Printing weather report");
    postMessage.call(this, this.lastForecast.print());
  }
  if (data.content.toLowerCase().indexOf("memes") > -1) {
    console.log("Shitposting");
    postMessage.call(this, "/gif memes");
  }
  if (data.content.toLowerCase().indexOf("pics") > -1) {
    console.log("Get HYPE (posting pics)");
    postMessage.call(this, "GET HYPE\nhttps://static1.merinet.com/image_uploader/webcam/large/meribel-panoramic-webcam.jpg");
  }
}

Bot.prototype.startBot = function() {
  console.log("Starting internal slack bot");
  var self = this; //you... YOU..

  this.slack.on("start", function() {

    self.slackId = self.slack.getUserId(self.config.Username);
    self.channelId = self.slack.getChannelId(self.config.SlackChannel);

    postMessage.call(self, "Hello! Snow is back baby!");

    console.log("Sleeping for %d", self.config.ReportInterval);
    wakeUp.call(self);

    // node_schedule.scheduleJob("*  45   9   * * 1-5", () => postPics.call(self, "Goood morning! Time to get HYPE"));
    // node_schedule.scheduleJob("*   0  13   * * 1-5", () => postPics.call(self, "How's the day treating you hmm? Well, here's some snow!"));
    // node_schedule.scheduleJob("*  30  15   * * 1-5", () => postPics.call(self, "Another day almost done till the HYPE train 'toot toots'!"));
    // //Every 10 min, 8 till 5, mon to fri
    // node_schedule.scheduleJob("* */10 8-17 * *  1-5", () => wakeUp.call(self));

    self.jobs = {};
    self.jobs.MorningCheck = new CronJob("0 45 9 * * 1-5", () => postPics.call(self, "Goood morning! Time to get HYPE"), null, true);
    self.jobs.LunchCheck   = new CronJob("0 0 13 * * 1-5", () => postPics.call(self, "How's the day treating you hmm? Well, here's some snow!"), null, true);
    self.jobs.EveningCheck = new CronJob("0 30 15 * * 1-5", () => postPics.call(self, "Another day almost done till the HYPE train 'toot toots'!"), null, true);
	// Every 10 min, 8 till 5, mon to fri
	self.jobs.ReportCheck  = new CronJob("0 */10 8-17 * * 1-5",() => wakeUp.call(self), null, true);
  });


  this.slack.on("message", function(data) {
    handleMessage.call(self, data);
  });
};
Bot.prototype.stopBot = function() {

};

module.exports = Bot;
