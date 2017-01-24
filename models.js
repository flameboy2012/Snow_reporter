var Forecast = function (forecast) {
	this.conditions = forecast.conditions;
	this.last_snow_date = forecast.last_snow_date;
	this.lower_snow_depth = forecast.lower_snow_depth;
	this.report_date = new Date(forecast.report_date);
	this.upper_snow_depth = forecast.upper_snow_depth;

	this.print = function () {
		return "Report Date : " + this.report_date + "\n" +
		"Current Conditions : " + this.conditions + "\n" +
		"Lower Snow Depth 	: " + this.lower_snow_depth + "cm\n" +
		"Upper Snow Depth 	: " + this.upper_snow_depth + "cm\n" +
		"Last Snow Date 	: " + this.last_snow_date;
	};

	this.compare = function (forecast) {
		var newDate = new Date(forecast.report_date);
		if (newDate.getTime() > this.report_date.getTime()){
			return true;
		}
		return false;
	};

	this.toJson = function () {
		return {
			conditions: this.conditions,
			last_snow_date: this.last_snow_date,
			lower_snow_depth: this.lower_snow_depth,
			report_date: this.report_date,
			upper_snow_depth: this.upper_snow_depth
		};
	};
};

module.exports = Forecast;