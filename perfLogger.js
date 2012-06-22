var perfLogger = function(){
	var serverLogURL = "savePerfData.php",
		loggerPool = [];
		
		function calculateResults(id){
			loggerPool[id].runtime = loggerPool[id].stopTime - loggerPool[id].startTime;
			loggerPool[id].url = window.location.href;
			loggerPool[id].useragent = navigator.userAgent;
			return loggerPool[id]
		}
		
		function drawToDebugScreen(id){
			var debug = document.getElementById("debug")
			var output = formatDebugInfo(id)
			if(!debug){
				var divTag = document.createElement("div");
				divTag.id = "debug";
				divTag.innerHTML = output
				document.body.appendChild(divTag); 		  
			}else{
				debug.innerHTML += output
			}
		}

		function logToServer(id){
			var params = "data=" + (JSON.stringify(loggerPool[id]));
			var xhr = new XMLHttpRequest();
			xhr.open("POST", serverLogURL, true);
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
		
		function formatDebugInfo(id){
			var debuginfo = "<p><strong>" + loggerPool[id].description + "</strong><br/>";	
			if(loggerPool[id].avgRunTime){
				debuginfo += "average run time: " + loggerPool[id].avgRunTime + "ms<br/>";
			}else{
				debuginfo += "run time: " + loggerPool[id].runtime + "ms<br/>";
			}
			debuginfo += "path: " + loggerPool[id].url + "<br/>";
			debuginfo += "useragent: " +  loggerPool[id].useragent + "<br/>";
			debuginfo += "</p>";
			return debuginfo
		}
		
	return {
	startTimeLogging: function(id, descr,drawToPage,logToServer){
		loggerPool[id] = {};
		loggerPool[id].id = id;
		loggerPool[id].startTime = new Date;
		loggerPool[id].description = descr;
		loggerPool[id].drawtopage = drawToPage;
		loggerPool[id].logtoserver = logToServer
	},
	
	stopTimeLogging: function(id){
		loggerPool[id].stopTime = new Date;
		calculateResults(id);
		if(loggerPool[id].drawtopage){
			drawToDebugScreen(id);
		}
		if(loggerPool[id].logtoserver){
			logToServer(id);
		}
	},
	
	
	logBenchmark: function(id, timestoIterate, func, drawToPage, logToServer){
		var timeSum = 0;
		for(var x = 0; x < timestoIterate; x++){
			perfLogger.startTimeLogging(id, "benchmarking "+ func,drawToPage, logToServer);
			func();
			perfLogger.stopTimeLogging(id)
			timeSum += loggerPool[id].runtime
		}
		loggerPool[id].drawtopage = drawToPage;
		loggerPool[id].avgRunTime = timeSum/timestoIterate
			if(loggerPool[id].drawtopage){
				drawToDebugScreen(id)
			}
	}
}
}();