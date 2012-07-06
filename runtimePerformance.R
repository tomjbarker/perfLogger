dataDirectory <- "/Applications/MAMP/htdocs/lab/log/"
chartDirectory <- "/Applications/MAMP/htdocs/lab/charts/"
testname = "page_render"

perflogs <- read.table(paste(dataDirectory, "runtimeperf_results.csv", sep=""), header=TRUE, sep=",")
perfchart <- paste(chartDirectory, "runtime_",testname, ".pdf", sep="")

loadTimeDistrchart <- paste(chartDirectory, "loadtime_distribution.pdf", sep="")
requestBreakdown <- paste(chartDirectory, "avgtime_inrequest.pdf", sep="")
loadtime_bybrowser <- paste(chartDirectory, "loadtime_bybrowser.pdf", sep="")

pagerender <- perflogs[perflogs$TestID == "page_render",]
df <- data.frame(pagerender$UserAgent, pagerender$RunTime)
df <- by(df$pagerender.RunTime, df$pagerender.UserAgent, mean)
df <- df[order(df)]

pdf(perfchart, width=10, height=10)
opar <- par(no.readonly=TRUE)
	par(las=1, mar=c(10,10,10,10))		
	barplot(df, horiz=TRUE)
par(opar)	
dev.off()


getDFByBrowser<-function(data, browsername){
	return(data[grep(browsername, data$UserAgent),])
}


printLoadTimebyBrowser <- function(){
	chrome <- getDFByBrowser(perflogs, "Chrome")
	firefox <- getDFByBrowser(perflogs, "Firefox")
 	ie <- getDFByBrowser(perflogs, "MSIE")

	meanTimes <- data.frame(mean(chrome$PerceivedLoadTime), mean(firefox$PerceivedLoadTime), mean(ie$PerceivedLoadTime))
	colnames(meanTimes) <- c("Chrome", "Firefox", "Internet Explorer")
	pdf(loadtime_bybrowser, width=10, height=10)
		barplot(as.matrix(meanTimes), main="Average Perceived Load Time\nBy Browser", ylim=c(0, 600), ylab="milliseconds")
	dev.off()
}


pdf(loadTimeDistrchart, width=10, height=10)
	hist(perflogs$PerceivedLoadTime, main="Distribution of Perceived Load Time", xlab="Perceived Load Time in Milliseconds", col=c("#CCCCCC"))
dev.off()

avgTimeBreakdownInRequest <- function(){

#expand exponential notation
options(scipen=100, digits=3)

#set any negative values to 0
perflogs$PageRenderTime[perflogs$PageRenderTime < 0] <- 0
perflogs$RoundTripTime[perflogs$RoundTripTime < 0] <- 0
perflogs$TCPConnectionTime[perflogs$TCPConnectionTime < 0] <- 0
perflogs$DNSLookupTime[perflogs$DNSLookupTime < 0] <- 0

#capture avg times
avgTimes <- data.frame(mean(perflogs$PageRenderTime), mean(perflogs$RoundTripTime), mean(perflogs$TCPConnectionTime), mean(perflogs$DNSLookupTime))
colnames(avgTimes) <- c("PageRenderTime", "RoundTripTime", "TCPConnectionTime", "DNSLookupTime")
pdf(requestBreakdown, width=10, height=10)
opar <- par(no.readonly=TRUE)
	par(las=1, mar=c(10,10,10,10))		
	barplot(as.matrix(avgTimes), horiz=TRUE, main="Average Time Spent\nDuring HTTP Request", xlab="Milliseconds")
par(opar)	
dev.off()
	
}

printLoadTimebyBrowser()
avgTimeBreakdownInRequest()