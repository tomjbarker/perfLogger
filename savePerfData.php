<?php
require("util/fileio.php");

$logfile = "log/runtimeperf_results.txt";
$benchmarkResults = formatResults($_POST["data"]);

saveLog($benchmarkResults, $logfile);

function formatResults($r){
	$r = stripcslashes($r);
	$r = json_decode($r);
	if(json_last_error() > 0){
		die("invalid json");
	}
	return($r);
}

function formatNewLog($file){
	$headerline = "IP, TestID, StartTime, StopTime, RunTime, URL, UserAgent";
	appendToFile($headerline, $file);
}

function saveLog($obj, $file){
	if(!file_exists($file)){
		formatNewLog($file);
	}
	$newLine = $_SERVER["REMOTE_ADDR"] . "," . $obj->id .",". $obj->startTime . "," . $obj->stopTime . "," . $obj->runtime . "," . $obj->url . "," . $obj->useragent;
	appendToFile($newLine, $file);
}

?>