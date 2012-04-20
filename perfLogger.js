var perfLogger = {
	loggerPool: [],
	startTimeLogging: function(id, descr){
		perfLogger.loggerPool[id] = {};
		perfLogger.loggerPool[id].startTime = new Date;
		perfLogger.loggerPool[id].description = descr;
	},
	
	stopTimeLogging: function(id){
		perfLogger.loggerPool[id].stopTime = new Date;
		return perfLogger.showResults(id);
	},
	
	showResults: function(id){
		return {
			runtime: perfLogger.loggerPool[id].stopTime - perfLogger.loggerPool[id].startTime,
			resultID: id,
			starttime: perfLogger.loggerPool[id].startTime,
			stoptime: perfLogger.loggerPool[id].stopTime,
			url:window.location,
			useragent: window.useragent
		}
	},
	
	logBenchmark: function(id, timestoIterate, func){
		var timeSum = 0;
		for(var x = 0; x < timestoIterate; x++){
			perfLogger.startTimeLogging(id, "benchmarking function "+ func);
			func();
			timeSum += perfLogger.stopTimeLogging(id).runtime
		}
		return {
			avgRunTime: timeSum/timestoIterate,
			description: "benchmarking function "+ func,
			url:window.location,
			useragent: window.useragent
		}
	}
}