const express = require('express');
const router = express.Router();
const fs = require('fs');
var bytes = require('utf8-length');
var keyexptime= 10;//minitues
var filepath = "./db/data.json";
router.post('/Create', (req, res, next) => {
	var jsonContent = req.body;
	var getfilesize = false;
	var keycheck = false;
	for (const [key, value] of Object.entries(jsonContent)) {
		var letters = /^[A-Za-z]+$/;
		var date = new Date();
		value['timestamp']=date.getTime();
		if (fs.existsSync(filepath)) {
			var rawdata = fs.readFileSync(filepath);
			var jsonfiledata = JSON.parse(rawdata);
			var stats = fs.statSync(filepath);
			if (jsonfiledata.hasOwnProperty(key)) {
				var keycheck = true;
			} else if ((bytes(JSON.stringify(value)) >= 16 * 1024 * 1024) && (stats.size > 1024 * 1020 * 1024)) {
				getfilesize = true;
			}
		}
		if (!key.match(letters)) {
			res.json({
				Errormsg: " Invalind key...! key name must contain only alphabets and no special characters or numbers"
			});
			return;
		}
	}

	if (keycheck === true) {
		res.json({
			Errormsg: "key already exist...!"
		});
		return;
	} else if (getfilesize === true) {
		res.json({
			Errormsg: "Memory limit exceeded...!"
		});
		return;
	} else {
		if (fs.existsSync(filepath)) {
			var rawdata = fs.readFileSync('./db/data.json');
			var readdata = JSON.parse(rawdata);
			var jsonContent = Object.assign(readdata, jsonContent);
		}		
		fs.writeFile(filepath, JSON.stringify(jsonContent), 'utf8', function (err) {
			if (!err) {
				res.json({
					Succmsg: "File created successfully and data inserted successfully"
				});
				return;
			} else {
				res.json({
					Errormsg: "File not created..! something went wrong"
				});
				return;
			}
		});
	}
});

router.get('/Readone/:id', (req, res, next) => {
	
	if (req.params ) {
		if(fs.existsSync(filepath)){
		var rawdata = fs.readFileSync(filepath);
		var readdataone = JSON.parse(rawdata);		
		var readdata = readdataone[req.params.id];
		if(readdata && readdata.timetolive === 1){
			var date = new Date();
			var timediff= date.getTime() - readdata.timestamp;
			var seconds = Math.floor(timediff / 1000);
			var minute = Math.floor(seconds / 60);
			console.log(minute);
			if(minute>keyexptime){
				res.json({
					Errormsg: "Specfied Key Expired...!  Record not found"
				});
				return;
			}
		}
		
		if(readdata){
			res.json({
				data: readdata
			});
			return;
		}else{
			res.json({
				Errormsg: "Record not found...!"
			});
			return;
		}
			
		
	}else{
		res.json({
			Errormsg: "File Not found"
		});
		return;
	}
	} else {
		res.json({
			Errormsg: "Please provide any Key"
		});
		return;
	}
});

router.get('/Delete/:id', (req, res, next) => {
	if (req.params) {
		if(fs.existsSync(filepath)){
		var rawdata = fs.readFileSync(filepath);
		var readdataone = JSON.parse(rawdata);		
		var readdata = readdataone[req.params.id];
		if(readdata.timetolive && readdata.timetolive === 1){
			var date = new Date();
			var timediff= date.getTime() - readdata.timestamp;
			var seconds = Math.floor(timediff / 1000);
			var minute = Math.floor(seconds / 60);
			console.log(minute);
			if(minute>keyexptime){
				res.json({
					Errormsg: "Specfied Key Expired...!  Record not found to delete"
				});
				return;				
			}
		}
			var data = fs.readFileSync(filepath);
			var json = JSON.parse(data);
			var totalobjlen = Object.keys(json).length;
			delete json[req.params.id];
			var deltotalobjlen = Object.keys(json).length;
			if (totalobjlen != deltotalobjlen) {
				fs.writeFileSync('./db/data.json', JSON.stringify(json, null, 2));
				res.json({
					Succmsg: "Deleted Successfully"
				});
				return;
			} else {
				res.json({
					Errormsg: "Not Deleted"
				});
				return;
			}
		
	}else{
		res.json({
			Errormsg: "File Not found"
		});
		return;
	}
	} else {
		res.json({
			Errormsg: "Please provide any Key"
		});
		return;
	}
});


module.exports = router;