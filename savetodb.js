var mqtt=require('mqtt')
var mongodb=require('mongodb');

var mongodbClient=mongodb.MongoClient;
var mongodbURI='mongodb://localhost/sensors'
var deviceRoot="sensors/out/"
var collection,client;

mongodbClient.connect(mongodbURI,setupCollection);

function setupCollection(err,db) {
  if(err) throw err;
  collection=db.collection("IoT");
  client=mqtt.connect('mqtt://localhost')
  client.subscribe(deviceRoot+"+")
  client.on('message', insertEvent);
}

function insertEvent(topic,payload) {
  var key=topic.replace(deviceRoot,'');
  var value = JSON.parse(payload.toString());

  if (value.data)
  {
    collection.update(
      { _id:key },
      { $set: value },
      { upsert:true },
      function(err,docs) {
        if(err) { console.log("Insert fail: " + err); } // Improve error handling
      }
    );

    value.data.when = new Date();
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

