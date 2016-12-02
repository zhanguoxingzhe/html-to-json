<?php
$url = 'http://www.cctv.com/';
$curl = curl_init(); 
curl_setopt($curl, CURLOPT_URL, $url); 
curl_setopt($curl, CURLOPT_HEADER, 1); 
curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);	
$data = curl_exec($curl); 
//print_r($data);
curl_close($curl);
preg_match_all('/<link +[rel="stylesheet"]*.*href="([^"]+)".*[rel="stylesheet"]*/i', $data,$arr);
preg_match("/<body.*?>(.*?)<\/body>/is", $data, $body);
preg_match("/<style.*?>(.*?)<\/style>/is", $data, $style);
$bodystr = characet(trim($body[1]));
outputjson($url,$arr[1],$bodystr,$style[1]);

function characet($data){
	if( !empty($data) ){
		$fileType = mb_detect_encoding($data , array('UTF-8','GBK','LATIN1','BIG5')) ;
		if( $fileType != 'UTF-8'){
			$data = mb_convert_encoding($data ,'utf-8' , $fileType);
		}
	}
	return $data;
}

function outputjson($url,$css,$body,$style){
	$arr = array('url' => $url, 'css' => $css, 'style' => $style);
	//print_r($arr);
	$str = json_encode($arr).'--body--'.$body;
	echo $str;
}