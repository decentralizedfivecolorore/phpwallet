var flagstop = false;

function fetchLanIP(){
	if(flagstop){
		intval = window.clearInterval(intval);
	}
	$.ajax({
		url: '?action=fetchLanIP',
		type: 'POST',
		dataType: 'json',
		data: {},
		success: function (data) {
			console.log(data);
			if (data.status) {
				var obj = data.obj;
				//lasttime = obj[0].timeline;
				//obj.reverse();
				console.log(obj);
				if(obj.mac){
					$(".mac").text(obj.mac);
				}
				if(obj.ip){
					$(".ip").text(obj.ip);
				}
				if(obj.mac && obj.ip){
					flagstop = true;
					$(".initstaff").css('display','');
					initDevice();
					//$(".nextstepdesc").css('display','');
				}
			} else{
				$(".mac").text(data.info);
				$(".ip").text(data.info);
			};
		},
		error:function (XMLHttpRequest, textStatus, errorThrown) {

		},
		complete:function (XMLHttpRequest, textStatus) {

		}
	});
}

function fetchWalletInfo(){
	$.ajax({
		url: '?action=fetchWalletInfo',
		type: 'post',
		dataType: 'json',
		data: {},
		success: function (data) {
			console.log(data);
			if (data.status) {
				var obj = data;
				//lasttime = obj[0].timeline;
				//obj.reverse();
				//console.log(obj);
				$(".balance").text(obj.balance);
				
				if(obj.getconnectioncount >= 1){
					if(obj.getgenerate){
						$(".status").text('Mining...');
					}
					else{
						$(".status").text('Synchronizing...');
					}
				}
				else{
					$(".status").text('Connecting...');
				}
				var listsinceblock = obj.listsinceblock.transactions;
				console.log(listsinceblock);
				var immaturebalance = 0;
				$.each(listsinceblock, function(index) {
					console.log(listsinceblock[index]);
					
					if(listsinceblock[index].category == 'immature'){
						immaturebalance += listsinceblock[index].amount;
					}
				});
				$(".unconfirmedbalance").text(obj.unconfirmedbalance + immaturebalance);
				$('table').html('');
				var listtransactions = obj.listtransactions;
				//console.log(listtransactions);
				$.each(listtransactions, function(index) {
					//console.log(listtransactions[index]);
					
					if(listtransactions[index].generated == true){
						var categoryImg = 'img/tx_mined.png';
					}
					else{
						switch(listtransactions[index].category){
							case 'send':
								var categoryImg = 'img/tx_output.png';
								break;
							default:
								var categoryImg = 'img/tx_airdrop.png';
								break;
						}
					}
					//var unixTimestamp = new Date(listtransactions[index].time * 1000);
					//time = unixTimestamp.toLocaleString()
					var time = new Date(listtransactions[index].time * 1000).Format("yyyy-MM-dd hh:mm:ss");
					switch(true){
						case listtransactions[index].confirmations >= 1000:
							var confirmationsImg = 'img/transaction2.png';
							break;
						case listtransactions[index].confirmations >= 800:
							var confirmationsImg = 'img/clock5.png';
							break;
						case listtransactions[index].confirmations >= 600:
							var confirmationsImg = 'img/clock4.png';
							break;
						case listtransactions[index].confirmations >= 400:
							var confirmationsImg = 'img/clock3.png';
							break;
						case listtransactions[index].confirmations >= 200:
							var confirmationsImg = 'img/clock2.png';
							break;
						default:
							var confirmationsImg = 'img/clock1.png';
							break;
					}
					if(listtransactions[index].amount > 0){
						var amountClass = '';
						var amountSymbol = '+';
					}
					else{
						var amountClass = 'negative';
						var amountSymbol = '-';
					}
					var amount = listtransactions[index].amount;
					$('table').prepend(
						'<tr>'+
							'<td><img src="'+categoryImg+'" width="64" height="64" /></td>'+
							'<td>'+time+'</td>'+
							'<td><img src="'+confirmationsImg+'" width="32" height="32" /></td>'+
							'<td class="amount"><span class="'+amountClass+'">'+amountSymbol+amount+'</span> ABS</td>'+
						'</tr>'
					);
				});
			} else{
				$(".balance").text(data.info);
				$(".unconfirmedbalance").text('');
				$(".status").text('');
				$('table').html('');
			};
		},
		error:function (XMLHttpRequest, textStatus, errorThrown) {
			$(".balance").text(textStatus);
			$(".unconfirmedbalance").text('');
			$(".status").text('');
			$('table').html('');
		},
		complete:function (XMLHttpRequest, textStatus) {

		}
	});
}

/** 
 * Convert number by comma  
 * @character_set UTF-8 
 * @author Jerry.li(hzjerry@gmail.com) 
 * @version 1.2014.08.24.2143 
 *  Example 
 *  <code> 
 *      alert($.formatMoney(1234.345, 2)); //=>1,234.35 
 *      alert($.formatMoney(-1234.345, 2)); //=>-1,234.35 
 *      alert($.unformatMoney(1,234.345)); //=>1234.35 
 *      alert($.unformatMoney(-1,234.345)); //=>-1234.35 
 *  </code> 
 */  
;(function($)  
{  
    $.extend({  
        /** 
         * Convert number by comma 
         * @public 
         * @param mixed mVal  
         * @param int iAccuracy 
         * @return string 
         */  
        formatMoney:function(mVal, iAccuracy){  
            var fTmp = 0.00;  
            var iFra = 0;  
            var iInt = 0;  
            var aBuf = new Array();  
            var bPositive = true; 
            /** 
             * output string with 0 
             * <li></li> 
             * @param int iVal 
             * @param int iLen 
             */  
            function funZero(iVal, iLen){  
                var sTmp = iVal.toString();  
                var sBuf = new Array();  
                for(var i=0,iLoop=iLen-sTmp.length; i<iLoop; i++)  
                    sBuf.push('0');  
                sBuf.push(sTmp);  
                return sBuf.join('');  
            };  
  
            if (typeof(iAccuracy) === 'undefined')  
                iAccuracy = 2;  
            bPositive = (mVal >= 0); 
            fTmp = (isNaN(fTmp = parseFloat(mVal))) ? 0 : Math.abs(fTmp);  
            
            iInt = parseInt(fTmp);  
            iFra = parseInt((fTmp - iInt) * Math.pow(10,iAccuracy) + 0.5);  
  
            do{  
                aBuf.unshift(funZero(iInt % 1000, 3));  
            }while((iInt = parseInt(iInt/1000)));  
            aBuf[0] = parseInt(aBuf[0]).toString();  
            return ((bPositive)?'':'-') + aBuf.join(',') +'.'+ ((0 === iFra)?'00':funZero(iFra, iAccuracy));  
        },  
        /** 
         * Convert string to float
         * @public 
         * @param string sVal
         * @return float 
         */  
        unformatMoney:function(sVal){  
            var fTmp = parseFloat(sVal.replace(/,/g, ''));  
            return (isNaN(fTmp) ? 0 : fTmp);  
        },  
    });  
})(jQuery); 

function formatSeconds(value) {
    var theTime = parseInt(value);// second
    var theTime1 = 0;// minute
    var theTime2 = 0;// hour

    if(theTime > 60) {
        theTime1 = parseInt(theTime/60);
        theTime = parseInt(theTime%60);
		if(theTime1 > 60) {
			theTime2 = parseInt(theTime1/60);
			theTime1 = parseInt(theTime1%60);
		}
    }

	var result = ""+parseInt(theTime)+"second";
	if(theTime1 > 0) {
		result = ""+parseInt(theTime1)+"minute"+result;
	}

	if(theTime2 > 0) {
		result = ""+parseInt(theTime2)+"hour"+result;
	}
    return result;
}

function formatHours(value) {
    var theTime = parseInt(value);// second
    var theTime1 = 0;// minute
    var theTime2 = 0;// hour
    if(theTime > 60) {
        theTime1 = parseInt(theTime/60);
        theTime = parseInt(theTime%60);
        if(theTime1 > 60) {
            theTime2 = parseInt(theTime1/60);
            theTime1 = parseInt(theTime1%60);
        }
    }

	var result = '';
	if(theTime1 > 0) {
		result = ""+parseInt(theTime1)+""+result;
	}
	if(theTime2 > 0) {
		result = ""+parseInt(theTime2)+":"+result;
	}
    return result;
}

// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //month 
        "d+": this.getDate(), //day 
        "h+": this.getHours(), //hour 
        "m+": this.getMinutes(), //minute 
        "s+": this.getSeconds(), //second 
        "q+": Math.floor((this.getMonth() + 3) / 3), //season 
        "S": this.getMilliseconds() //millisecond 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}