
var fs = require("fs");

var default_params = {
  icon_emoji: ':snowman:'
};

module.exports = {
  readConfig(configFile) {

    if (!fs.existsSync(configFile)) {
      throw new Error("Config file does not exist");
    }

    var config = JSON.parse(fs.readFileSync(configFile, "utf8"));

    if (!('SlackToken' in config)) {
      throw new Error("No slack token in config");
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

    return config;
  }
};
