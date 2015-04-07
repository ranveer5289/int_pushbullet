'use strict';

var ajax = require('./ajax');
var sendToDevice = {
	init : function () {

		//pushbullet Device List
		$('.send-to-device').click(function (e) {
			e.preventDefault();
			sendToDevice.populatePushbulletDetails();
		});

		$('#pushbulletSubmit').on('click', function () {
			sendToDevice.sendPushbulletData();
		});
	},

	populatePushbulletDetails : function () {
		var url = Urls.pushbulletGetUserDevices;
		ajax.getJson({
			url : url,
			callback : function (data) {
				if (typeof(data.error) == "undefined")
					sendToDevice.setpushbulletFields(data);
				else
					$('.pushbulletDeviceList .status').append(data.error.message);

			}
		});
	},

	sendPushbulletData : function () {
		
		var linkToSend = $('#pushbulletLink').val();
		var title = $('title').text();

		var dataObject = {
			"linkToSend" : linkToSend,
			"title" : title
		}
		
		if($('input:radio[id="pushbulletContact"]:checked').length){
			dataObject.email = $('input:radio[id="pushbulletContact"]:checked').attr('value');
			
		}else{
			dataObject.deviceId = $('input:radio[id="pushbulletDevice"]:checked').attr('value');
			
		}

		var url = Urls.pushbulletSendNotification;
		ajax.getJson({
			url : url,
			data : dataObject,
			callback : function (data) {
				if (typeof(data.error) == "undefined")
					$('.pushbulletDeviceList .status').html("").append("Successfull..!!!");
				else
					$('.pushbulletDeviceList .status').html("").append(data.error.message);
			}
		});

	},

	setpushbulletFields : function (data) {
		var devices = data.devices; 
		var contacts = data.contacts;
		var pbClass = ".pushbulletDeviceList";
		devices.forEach(function (device) {

			if (device.active) {
				var radiobutton = '<input type="radio" id =pushbulletDevice name="pbdevices" value=' + device.iden + '>' + device.nickname + '<br>';
				$(pbClass).prepend(radiobutton);
			}
		});
		contacts.forEach(function (contact) {

			if (contact.active) {
				var radiobutton = '<input type="radio" id =pushbulletContact name="pbdevices" value=' + contact.email + '>' + contact.name + " (Contact)" +  '<br>';
				$(pbClass).prepend(radiobutton);
			}
		});
		$('#pushbulletLink, #pushbulletSubmit').css('display', 'block')
	}

};

module.exports = sendToDevice;
