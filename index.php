<?php
require_once('easybitcoin.php');
header("Content-type: text/html; charset=utf-8");
$bitcoinRPCUser = 'bitcoinrpc';
$bitcoinRPCPass = 'HgCh95SWZgL6pUjqfrJu6Fw4e3HuRxQWKozcyZKS4P9C';
$bitcoinRPCHost = '127.0.0.1';
$bitcoinRPCPort = '19912';

$action = $_GET['action'];
switch($action){
	case 'fetchLanIP':
		$rs = exec ('ifconfig', $resultArray, $status);
		//echo $rs;
		//print_r($resultArray);
		//echo $status;
		if($status == 0){
			$result = explode('HWaddr', $resultArray[0]);
			$result = trim($result[1]);
			//echo $result;
			$result1 = str_cut($resultArray[1], 'inet addr:', 'Bcast:');
			$result1 = trim($result1);
			$data=array();
			$data['status'] = 1;
			$data['error'] = 0;
			$data['obj']['mac'] = $result;
			$data['obj']['ip'] = $result1;
			exit(json_encode($data));
		}
		$data=array();
		$data['status'] = 0;
		$data['error'] = 1;
		$data['info'] = $rs;
		exit(json_encode($data));
		break;
	case 'fetchWalletInfo':
		$bitcoin = new Bitcoin($bitcoinRPCUser, $bitcoinRPCPass, $bitcoinRPCHost, $bitcoinRPCPort);
		$getbalance = $bitcoin->getbalance();
		//$getunconfirmedbalance = $bitcoin->getunconfirmedbalance();
		//$listsinceblock = $bitcoin->listsinceblock();
		//$getgenerate = $bitcoin->getgenerate();
		//$getconnectioncount = $bitcoin->getconnectioncount();
		//$listtransactions = $bitcoin->listtransactions("", 3, 0);
		
		//echo $bitcoin->response;
		//echo $bitcoin->raw_response;
		if($bitcoin->status == 200){
			$data = array();
			$data['status'] = 1;
			$data['error'] = 0;
			$data['balance'] = $getbalance;
			$data['unconfirmedbalance'] = $bitcoin->getunconfirmedbalance();
			$data['listsinceblock'] = $bitcoin->listsinceblock();
			$data['getgenerate'] = $bitcoin->getgenerate();
			$data['getconnectioncount'] = $bitcoin->getconnectioncount();
			$data['listtransactions'] = $bitcoin->listtransactions("", 3, 0);
			exit(json_encode($data));
		}
		$data=array();
		$data['status'] = 0;
		$data['error'] = 1;
		$data['info'] = $bitcoin->error;
		exit(json_encode($data));
		break;
}
?>
<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>Terminal</title>
    <link rel="stylesheet" href="css/main.css">
</head>

<body>
<div class="head">
	<h1>Decentralized Absolutely Bull Shit</h1>
	<img src="img/logo.png" width="100" height="100" />
	<h1>Dig and Airdrop</h1>
</div>
<div class="main">
<?php
$step = $_GET['step'];

switch($step){
	default:
		?>
		<div id="step1">
			<!--<h1>STEP1</h1>-->
			<h1>Plug in an Ethernet wire</h1>
			<div style="clear:both;"></div>
			<div>
				<h1><span>MAC: </span><span class="mac">loading...</span></h1>
				<h1><span>IPv4: </span><span class="ip">loading...</span></h1>
			</div>
			<h1 class="initstaff" style="display:none;">Initializing your device</h1>
			<h1 class="nextstepdesc" style="display:none;">Browse the http://<span class="ip"></span>/?step=2 use your phone</h1>
		</div>
		<script>var intval = setInterval("fetchLanIP()", 1000);</script>
		<?php
		break;
	case 2:
		?>
		<div id="step2">
			<h1>Balance: <span class="balance"></span> ABS</h1>
			<h1>Unconfirmed: <span class="unconfirmedbalance"></span> ABS</h1>
			<h1>Status: <span class="status"></span></h1>
			<div style="clear:both;"></div>
			<div>
				<table>
				</table>
			</div>
		</div>
		<script>var intval = setInterval("fetchWalletInfo()", 1000);</script>
		<?php
		break;
	case 99999:
		?>
		<div id="step1">
			<h1>STEP2</h1>
			<h1>Set WIFI</h1>
			<div style="clear:both;"></div>
			<div>
				<form action="?action=upload" method=post>
				SSID:<input type=text name="ssid"><br>
				PASS:<input type=text name="pass"><br>
				<input type=submit value="Submit">
				</form>
			</div>
			<h1 id="nextstepdesc" style="display:none;">Browse the http://<span class="ip"></span>/?step=2 use your phone</h1>
		</div>
		<?php
		break;
}

?>
</div>
<div class="foot">
<h2>This is a testing project. You may join us for just funny.</h2>
<h2>This is absolutely bullshit project. Don't take it seriously.</h2>
<h2>2016-2017</h2>
</div>
<script src="js/jquery-3.1.1.min.js"></script>
<script src="js/main.js"></script>
</body>
</html>

<?php
function str_cut($string ,$start, $end) {
	$string = strstr( $string, $start );
	$string = substr( $string, strlen( $start ), strpos( $string, $end ) - strlen( $start ) );
	return $string;
}
?>