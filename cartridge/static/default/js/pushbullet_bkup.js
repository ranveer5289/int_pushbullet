'use strict';

var ajax = require('./ajax');
var sendToDevice = {
	init: function () {
		
		//pushbullet Device List
		$('.send-to-device').click(function(e){ 
			e.preventDefault();
			alert('clicked');
			sendToDevice.populatePushbulletDetails();
		});

		$('#pushbulletSubmit').on('click', function () {
			console.log("jkjk");
			sendToDevice.sendPushbulletData();
		});
	},
	
	
	populatePushbulletDetails : function () {
		// load card details
		alert('populatePushbulletDetails');
		var url = Urls.pushbulletGetUserDevices;
		ajax.getJson({
			url: url,
			callback: function (data) {
				if(typeof (data.error) == "undefined")
					sendToDevice.setpushbulletFields(data);
				else
					$('.pushbulletDeviceList .status').append(data.error.message);
					
			}
		});
	},
	
	sendPushbulletData : function () {
		var deviceId = $('input:radio[id="pushbulletDevice"]:checked').attr('value');
		var linkToSend = $('#pushbulletLink').val();
		var title = $('title').text();
		alert(deviceId);
		
		var dataObject  = {
				"deviceId" : deviceId,
				"linkToSend" : linkToSend,
				"title"      : title
		}
		
		var url = Urls.pushbulletSendNotification;
		ajax.getJson({
			url: url,
			data : dataObject,
			callback: function (data) {
				if(typeof (data.error) == "undefined")
					$('.pushbulletDeviceList .status').html("").append("Successfull..!!!");
				else
					$('.pushbulletDeviceList .status').html("").append(data.error.message);
			}
		});
		
		
		
	},
	
	setpushbulletFields : function (data) {
		alert('setpushbulletFields');
		var devices = data.devices;
		var pbClass = ".pushbulletDeviceList";
		devices.forEach(function(device){
			
			if(device.active){
				var checkbox = '<input type="radio" id =pushbulletDevice name="pbdevices" value=' + device.iden + '>' + device.nickname + '<br>';
				$(pbClass).prepend(checkbox);			
			}
		});
	}

};

module.exports = sendToDevice;
