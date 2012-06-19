<?php
function appendToFile($data, $file){
	echo "writing to file $file\n";
	$writeFlag = "w";
	if(file_exists($file)){
			$writeFlag = "a";
	}	
	$fh = fopen($file, $writeFlag) or die("can't open file");
	fwrite($fh, $data . "\n");
	fclose($fh);
}

?>