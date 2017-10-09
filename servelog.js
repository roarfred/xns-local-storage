var express = require('express');
var app = express();

var mongodb=require('mongodb');

var mongodbClient=mongodb.MongoClient;
var mongodbURI='mongodb://localhost/sensors'
var collection;

mongodbClient.connect(mongodbURI,setupCollection);

function setupCollection(err,db) {
  if(err) throw err;
  collection=db.collection("IoT");
  client=mqtt.connect('mqtt://localhost')
}

app.get('/', function (req, res) {
    //res.sendFile(__dirname + '/index.htm');
    console.log('get /');
    
    collection.findOne({ id: "espdebugger"}, function(err, doc) {
        res.send(doc);
    });

    res.sendStatus(200);
});

app.listen(5001, function () {
	console.log('listening on port 5000')
});