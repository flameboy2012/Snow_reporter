var SlackBot = require("slackbots");
var request = require("request");

var config = require("./config");

var bot = new SlackBot({
	token: config.SlackToken,
	name: "snow_reporter"
});

bot.on("start", function () {

	var params = {
        icon_emoji: ':snowman:'
    };

    request("http://www.myweather2.com/developer/weather.ashx?uac=J8AGqmQdGv&uref=697ed4ad-377c-4122-84af-4fa0ddae8dac&output=json", function (err, res, body) {
		if (err)
			console.log(err);

		var report = JSON.parse(body);

		var snowReport = report.weather.snow_report[0];

		var message = "";

		Object.keys(snowReport).forEach(function(key) {
		    message += key + " : " + snowReport[key] + "\n";
		});

		console.log(message);


		bot.postMessageToChannel("general", message, params);
	});
});

