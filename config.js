
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

    if (!('Name' in config)) {
      config.Name = "snow_reporter";
    }

    if (!('ReportInterval' in config)) {
      config.ReportInterval = 600;
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
