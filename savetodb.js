var mqtt=require('mqtt')
var mongodb=require('mongodb');

var mongodbClient=mongodb.MongoClient;
var mongodbURI='mongodb://localhost/sensors'
var deviceRoot="sensors/out/"
var collection,client;
var history = {};

mongodbClient.connect(mongodbURI,setupCollection);

function setupCollection(err,db) {
  if(err) throw err;
  collection=db.collection("IoT");
  client=mqtt.connect('mqtt://localhost')
  client.subscribe(deviceRoot+"+")
  client.on('message', insertEvent);
}

function insertEvent(topic,payload) {
  var key = topic.replace(deviceRoot,'');
  //console.log("Received message: " + payload.toString());
  var value = JSON.parse(payload.toString());

  if (value.data)
  {
    var historyKey = key;
    if (value.data.s)
      historyKey += "/" + value.data.s;

    collection.update(
      { _id:key },
      { $set: value },
      { upsert:true },
      function(err,docs) {
        if(err) { console.log("Insert fail: " + err); } // Improve error handling
      }
    );

    if (!history[historyKey] || Math.abs(history[historyKey] - new Date()) > 60 * 1000)
    {
      value.data.when = new Date();
      history[historyKey] = value.data.when;
      collection.update(
        { _id:key },
        { $push: { history: value.data } },
        { upsert:true },
        function(err,docs) {
          if(err) { console.log("Insert fail: " + err); } // Improve error handling
        }
      );
    }
  }
}

