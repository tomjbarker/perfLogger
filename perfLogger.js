var perfLogger = {
	loggerPool: [],
	serverLogURL: "savePerfData.php",
	startTimeLogging: function(id, descr,drawToPage,logToServer){
		perfLogger.loggerPool[id] = {};
		perfLogger.loggerPool[id].id = id;
		perfLogger.loggerPool[id].startTime = new Date;
		perfLogger.loggerPool[id].description = descr;
		perfLogger.loggerPool[id].drawtopage = drawToPage;
		perfLogger.loggerPool[id].logtoserver = logToServer
	},
	
	stopTimeLogging: function(id){
		perfLogger.loggerPool[id].stopTime = new Date;
		perfLogger.showResults(id);
		if(perfLogger.loggerPool[id].drawtopage){
			perfLogger.drawToDebugScreen(id);
		}
		if(perfLogger.loggerPool[id].logtoserver){
			perfLogger.logToServer(id);
		}
	},
	
	showResults: function(id){
		perfLogger.loggerPool[id].runtime = perfLogger.loggerPool[id].stopTime - perfLogger.loggerPool[id].startTime;
		perfLogger.loggerPool[id].url = window.location.href;
		perfLogger.loggerPool[id].useragent = navigator.userAgent;
		return perfLogger.loggerPool[id]
	},
	
	logBenchmark: function(id, timestoIterate, func, drawToPage, logToServer){
		var timeSum = 0;
		for(var x = 0; x < timestoIterate; x++){
			perfLogger.startTimeLogging(id, "benchmarking "+ func,drawToPage, logToServer);
			func();
			perfLogger.stopTimeLogging(id)
			timeSum += perfLogger.loggerPool[id].runtime
		}
		perfLogger.loggerPool[id].drawtopage = drawToPage;
		perfLogger.loggerPool[id].avgRunTime = timeSum/timestoIterate
			if(perfLogger.loggerPool[id].drawtopage){
				perfLogger.drawToDebugScreen(id)
			}
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
	},
	
	logToServer: function(id){
		var params = "data=" + (JSON.stringify(perfLogger.loggerPool[id]));
		var xhr = new XMLHttpRequest();
		xhr.open("POST", perfLogger.serverLogURL, true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhr.setRequestHeader("Content-length", params.length);
		xhr.setRequestHeader("Connection", "close");
		xhr.onreadystatechange = function()
		  {
		  if (xhr.readyState==4 && xhr.status==200)
		    {
		    	console.log(xhr.responseText);
		    }
		  };
		xhr.send(params);
		

		
	}
}