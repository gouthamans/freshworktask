var express = require('express');
var bodyparser =require('body-parser');
var app = express();
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json()); //get the input from client

const route = require('./routes/routes');
app.use('/',route);

const port = 5000;
const address = '127.0.0.1';

var server = app.listen(port, address,function(){
	var host = server.address().address;
    var port = server.address().port;
    console.log('running at http://' + host + ':' + port)
});

