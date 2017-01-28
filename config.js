
var fs = require("fs");

var default_params = {
  icon_emoji: ':snowman:'
};

var images = [
  'https://static1.merinet.com/image_uploader/webcam/large/meribel-mont-vallon-cam.jpg',
  'https://static1.merinet.com/image_uploader/webcam/large/meribel-panoramic-webcam.jpg',
  'https://static1.merinet.com/image_uploader/webcam/large/meribel-moonpark-cam.jpg',
  'https://static1.merinet.com/image_uploader/webcam/large/meribel-la-saulire-cam.jpg',
  'https://static1.merinet.com/image_uploader/webcam/large/meribel-la-chaudanne-meeting-area-cam.jpg'
];

module.exports = {
  readConfig(configFile) {

    if (!fs.existsSync(configFile)) {
      throw new Error("Config file does not exist");
    }

    var config = JSON.parse(fs.readFileSync(configFile, "utf8"));

    if (!('SlackToken' in config)) {
      throw new Error("No slack token in config");
    }

    if (!('ReportUrl' in config)) {
      throw new Error("No report Url in config");
    }

    if (!('Username' in config)) {
      config.Username = "snow_reporter";
    }

    if (!('Name' in config)) {
      config.Name = "Snow Reporter";
    }

    if (!('ReportInterval' in config)) {
      config.ReportInterval = 600000;
    }

    if (!('SlackChannel' in config)) {
      config.SlackChannel = "general";
    }

    if (!('SlackPostParams' in config)) {
      config.SlackPostParams = default_params;
    }

    if (!('LastForecastFile' in config)) {
      config.LastForecastFile = '/var/lib/snow-reporter/last-forecast';
    }

    config.getRandomImage = function() {
      return images[(Math.random() * 100) % images.length];
    };

    return config;
  }
};
