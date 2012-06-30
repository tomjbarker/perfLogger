var perfLogger = function(){
	var serverLogURL = "savePerfData.php",
		loggerPool = [],
		_pTime = Date.now() - performance.timing.navigationStart || 0,
		_redirTime = performance.timing.redirectEnd - performance.timing.redirectStart || 0,
		_cacheTime = performance.timing.domainLookupStart - performance.timing.fetchStart || 0,
		_dnsTime = performance.timing.domainLookupEnd - performance.timing.domainLookupStart || 0,
		_tcpTime = performance.timing.connectEnd - performance.timing.connectStart || 0,
		_roundtripTime = performance.timing.responseEnd - performance.timing.connectStart || 0,
		_renderTime = Date.now() - performance.timing.domLoading || 0;
		
		function TestResults(){};
		TestResults.prototype.perceivedTime = _pTime;
		TestResults.prototype.redirectTime = _redirTime;
		TestResults.prototype.cacheTime = _cacheTime;
		TestResults.prototype.dnsLookupTime = _dnsTime;
		TestResults.prototype.tcpConnectionTime = _tcpTime;
		TestResults.prototype.roundTripTime = _roundtripTime;
		TestResults.prototype.pageRenderTime = _renderTime;
		
		function jsonConcat(object1, object2) {
		 for (var key in object2) {
		  object1[key] = object2[key];
		 }
		 return object1;
		}
							
		function calculateResults(id){
			loggerPool[id].runtime = loggerPool[id].stopTime - loggerPool[id].startTime;
		}
		
		function setResultsMetaData(id){
			loggerPool[id].url = window.location.href;
			loggerPool[id].useragent = navigator.userAgent;
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
			var params = "data=" + JSON.stringify(jsonConcat(loggerPool[id],TestResults.prototype));
			var xhr = new XMLHttpRequest();
			xhr.open("POST", serverLogURL, true);
			xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhr.setRequestHeader("Content-length", params.length);
			xhr.setRequestHeader("Connection", "close");
			xhr.onreadystatechange = function()
			  {
			  if (xhr.readyState==4 && xhr.status==200){}
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
		loggerPool[id] = new TestResults();
		loggerPool[id].id = id;
		loggerPool[id].startTime =  performance.now();
		loggerPool[id].description = descr;
		loggerPool[id].drawtopage = drawToPage;
		loggerPool[id].logtoserver = logToServer
	},
	
	stopTimeLogging: function(id){
		loggerPool[id].stopTime =  performance.now();
		calculateResults(id);
		setResultsMetaData(id);		
		if(loggerPool[id].drawtopage){
			drawToDebugScreen(id);
		}
		if(loggerPool[id].logtoserver){
			logToServer(id);
		}
	},
	
	logBenchmark: function(id, timestoIterate, func, debug, log){
		var timeSum = 0;
		for(var x = 0; x < timestoIterate; x++){
			perfLogger.startTimeLogging(id, "benchmarking "+ func, false, false);
			func();
			perfLogger.stopTimeLogging(id)
			timeSum += loggerPool[id].runtime
		}
		loggerPool[id].avgRunTime = timeSum/timestoIterate
		if(debug){
				drawToDebugScreen(id)
		}
		if(log){
				logToServer(id)
		}
	},
	
	//expose derived performance data
	perceivedTime: function(){
		return _pTime;
	}, 
	redirectTime: function(){
		_redirTime;
	}, 
	cacheTime: function(){
		return _cacheTime;
	}, 
	dnsLookupTime: function(){
		return _dnsTime;
	},
	tcpConnectionTime: function(){
		return _tcpTime;
	},
	roundTripTime: function(){
		return _roundtripTime;
	},
	pageRenderTime: function(){
		return _renderTime;
	}
}
}();

performance.now = (function() {
  return performance.now       ||
         performance.mozNow    ||
         performance.msNow     ||
         performance.oNow      ||
         performance.webkitNow ||
         function() { return new Date().getTime(); };
})();