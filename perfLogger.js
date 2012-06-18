var perfLogger = {
	loggerPool: [],
	startTimeLogging: function(id, descr,drawToPage){
		perfLogger.loggerPool[id] = {};
		perfLogger.loggerPool[id].id = id;
		perfLogger.loggerPool[id].startTime = new Date;
		perfLogger.loggerPool[id].description = descr;
		perfLogger.loggerPool[id].drawtopage = drawToPage;
	},
	
	stopTimeLogging: function(id){
		perfLogger.loggerPool[id].stopTime = new Date;
		perfLogger.showResults(id);
		if(perfLogger.loggerPool[id].drawtopage){
			perfLogger.drawToDebugScreen(id)
		}
	//	return perfLogger.showResults(id);
	},
	
	showResults: function(id){
		perfLogger.loggerPool[id].runtime = perfLogger.loggerPool[id].stopTime - perfLogger.loggerPool[id].startTime;
		perfLogger.loggerPool[id].url = window.location;
		perfLogger.loggerPool[id].useragent = navigator.userAgent;
		return perfLogger.loggerPool[id]
	},
	
	logBenchmark: function(id, timestoIterate, func, drawToPage){
		console.log("benchmarking " + id)
		var timeSum = 0;
		for(var x = 0; x < timestoIterate; x++){
			perfLogger.startTimeLogging(id, "benchmarking "+ func,true);
			func();
			perfLogger.stopTimeLogging(id)
			timeSum += perfLogger.loggerPool[id].runtime
		}
		console.log(perfLogger.loggerPool[id])
		perfLogger.loggerPool[id].drawtopage = drawToPage;
		perfLogger.loggerPool[id].avgRunTime = timeSum/timestoIterate
			if(perfLogger.loggerPool[id].drawtopage){
				perfLogger.drawToDebugScreen(id)
			}
		console.log("finished benchmarking " + id)	
	},
	formatDebugInfo: function(id){
		var debuginfo = "<p><strong>" + perfLogger.loggerPool[id].description + "</strong><br/>";	
		if(perfLogger.loggerPool[id].avgRunTime){
			debuginfo += "average run time: " + perfLogger.loggerPool[id].avgRunTime + "ms<br/>";
		}else{
			debuginfo += "run time: " + perfLogger.loggerPool[id].runtime + "ms<br/>";
		}
		debuginfo += "path: " + perfLogger.loggerPool[id].url + "<br/>";
		debuginfo += "useragent: " +  perfLogger.loggerPool[id].useragent + "<br/>";
		debuginfo += "</p>";
		return debuginfo
	},
	
	drawToDebugScreen: function(id){
		var debug = document.getElementById("debug")
		var output = perfLogger.formatDebugInfo(id)
		if(!debug){
			var divTag = document.createElement("div");
			divTag.id = "debug";
			divTag.innerHTML = output
			document.body.appendChild(divTag); 		  
		}else{
			debug.innerHTML += output
		}
	}
}