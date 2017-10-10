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
}

app.get('/', function (req, res) {
    //res.sendFile(__dirname + '/index.htm');
    console.log('get /');
    
    var d = new Date(); //2017, 9, 10, 0, 0, 0);
    d.setDate(d.getDate() - 1);
    console.log(d);

    collection.aggregate([
        {$match : { _id: "espdebugger"}},
        {$project: {
            history: {
                P: true, when: true
            }
        }},
        {$unwind: "$history"}, 
        {$match: {
            "history.when": { $gte: d } //{$exists:true}
            
//                { $gte:'2017-10-09T04:00:00Z', 
//                  $lt: '2018-10-01T04:00:00Z'
//                }
            }
        },
        {$project:
        {
            _id: false,
            P: "$history.P",
            when: "$history.when"
        }}
        //{ $group: { _id: null, count: { $sum: 1 } } }
/*
        {
            $project: {
                event : {
                    $filter: { 
                        input: "$event",
                        as: "evt",
                        cond: { $gte: ["$$evt.value.data.P", 500]}
                    } 
                }
            }
        }
        */
        //{$match : { when: {$gte : "2017"}}}
        //{$match : { value : { id : "espdebugger"}}}
    ], function(err, doc) {
        if (err)
            res.send(err);
        else
            res.send(doc);
    });
});

app.listen(5001, function () {
	console.log('listening on port 5001')
});