var express = require('express');

app.get('/', function (req, res) {
    //res.sendFile(__dirname + '/index.htm');
    console.log('get /');
    res.send("Hello!");
    res.sendStatus(200);
});

app.listen(5001, function () {
	console.log('listening on port 5000')
});