var SlackBot = require("slackbots");
var request = require("request");
var Forecast = require("./models");

var config = require("./config");

var bot = new SlackBot({
	token: config.SlackToken,
	name: "snow_reporter"
});

var forecast = null;

bot.on("start", function () {

	var params = {
        icon_emoji: ':snowman:'
    };

    setInterval(GetReport, 60000);

 //    request("http://www.myweather2.com/developer/weather.ashx?uac=J8AGqmQdGv&uref=697ed4ad-377c-4122-84af-4fa0ddae8dac&output=json", function (err, res, body) {
	// 	if (err)
	// 		console.log(err);

	// 	var report = JSON.parse(body);

	// 	forecast = new Forecast(report.weather.snow_report[0]);

	// 	bot.postMessageToChannel("general", message, params);

	// });
});

function GetReport () {
	request("http://www.myweather2.com/developer/weather.ashx?uac=J8AGqmQdGv&uref=697ed4ad-377c-4122-84af-4fa0ddae8dac&output=json", function (err, res, body) {
		if (err)
			console.log(err);

		var report = JSON.parse(body);

		if (forecast === null) {
			forecast = new Forecast(report.weather.snow_report[0]);
			bot.postMessageToChannel("general", forecast.print, params);
		} else {
			if (forecast.compare(report.weather.snow_report[0])) {
				forecast = new Forecast(report.weather.snow_report[0]);
				bot.postMessageToChannel("general", forecast.print, params);
			}
		}
	});
}
