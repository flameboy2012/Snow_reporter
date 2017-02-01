
var fs = require("fs");
var util = require("util");
var SlackBot = require("slackbots");
var request = require("request");
var CronJob = require('cron').CronJob;
var Forecast = require("./models");


function Bot(config) {
    this.config = config;
    this.lastForecast = getLastForecast.call(this);

    this.jobs = {};

    this.connected = false;

    this.slack = new SlackBot({
        token: this.config.SlackToken,
        name: this.config.Name
    });

    this.registerJob("DataCheck", "0 */10 8-17 * * 1-5", () => wakeUp.call(self));
}

function setLastForecast(forecast) {
  var forecastString = JSON.stringify(forecast);
  fs.writeFile(this.config.LastForecastFile, forecastString, (err) => {
    if (err) throw err;
    console.log("Last forecast written to file.");
  });
}

function getLastForecast() {
  if (fs.existsSync(this.config.LastForecastFile)) {
    console.log("Reading forecast file: %s", this.config.LastForecastFile);
    return new Forecast(JSON.parse(fs.readFileSync(this.config.LastForecastFile, 'utf8')));
  } else {
    console.log("No last forecast file found.");
    return null;
  }
}

function sendHello() {

  this.postMessage("Hello! Snow is back baby!");

}

function sendGoodbye() {

}

function wakeUp() {

  var self = this;
  var forecast = self.lastForecast;

  console.log("Getting new snow report");
  request(self.config.ReportUrl, function (err, res, body) {
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
    self.postMessage("Look what just got updated!\n" + forecast.print());
    setLastForecast.call(self, forecast.toJson());

    self.lastForecast = forecast;
  });
}

function handleMessage(data) {
  if (data.type != "desktop_notification")
    return;
  console.log("Recieved message");
  if (data.content.toLowerCase().indexOf("weather") > -1) {
    console.log("Printing weather report");
    this.postMessage(this.lastForecast.print());
  }
  if (data.content.toLowerCase().indexOf("memes") > -1) {
    console.log("Shitposting");
    this.postMessage("/gif memes");
  }
  if (data.content.toLowerCase().indexOf("pics") > -1) {
    console.log("Get HYPE (posting pics)");
    this.postPics("GET HYPE", null);
  }
}

Bot.prototype.registerJob = function(identifier, jobCronString, task) {

  if (identifier in this.jobs) {
    console.log("Stopping current '%s' job", identifier);
    this.jobs[identifier].stop();
  }

  console.log("Adding job '%s'", identifier);
  var job = new CronJob(jobCronString, task, null, true);
  this.jobs[identifier] = job;
};

Bot.prototype.postPics = function(message, image) {

  if (image === null || image === undefined) {
    console.log("Selecting random image");
    image = this.config.getRandomImage();
  }
  console.log("Posting pic %s", image);
  var now = util.format('%s', new Date().getTime());
  this.postMessage(
    util.format(
      "%s\n%s?%s",
      message,
      image,
      now.substring(now.length - 5)
    )
  );
  //postMessage.call(this, message + "\nhttps://static1.merinet.com/image_uploader/webcam/large/meribel-panoramic-webcam.jpg" + now);
};

Bot.prototype.postMessage = function(message) {

  if (!this.connected) {
    console.log("Not connected to slack, not posting message");
    return;
  }
  this.slack.postMessageToChannel(this.config.SlackChannel, message, this.config.SlackPostParams);
};

Bot.prototype.startBot = function() {
  console.log("Starting internal slack bot");
  var self = this; //you... YOU..

  this.slack.on("start", function() {

    self.slackId = self.slack.getUserId(self.config.Username);
    self.channelId = self.slack.getChannelId(self.config.SlackChannel);

    self.postMessage("Hello! Snow is back baby!");

    console.log("Sleeping for %d", self.config.ReportInterval);
    wakeUp.call(self);

    self.connected = true;

    // node_schedule.scheduleJob("*  45   9   * * 1-5", () => postPics.call(self, "Goood morning! Time to get HYPE"));
    // node_schedule.scheduleJob("*   0  13   * * 1-5", () => postPics.call(self, "How's the day treating you hmm? Well, here's some snow!"));
    // node_schedule.scheduleJob("*  30  15   * * 1-5", () => postPics.call(self, "Another day almost done till the HYPE train 'toot toots'!"));
    // //Every 10 min, 8 till 5, mon to fri
    // node_schedule.scheduleJob("* */10 8-17 * *  1-5", () => wakeUp.call(self));
  });


  this.slack.on("message", function(data) {
    handleMessage.call(self, data);
  });
};
Bot.prototype.stopBot = function() {

};

module.exports = Bot;
