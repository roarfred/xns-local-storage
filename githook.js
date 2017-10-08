/*
    Based on an ide by Daniel Egan
    http://thesociablegeek.com/node/github-continuous-deployment-to-a-raspberry-pi/ 
    https://github.com/DanielEgan/wackcoon-hook
*/

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var exec = require('child_process').exec;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.htm');
	console.log('get /');
});

app.get('/deploy', function (req, res) {
	console.log('get /deploy');
	console.log('pulling code from GitHub...');
    
    // reset any changes that have been made locally
    exec('git -C ~/xns-local-storage reset --hard', execCallback);

    // and ditch any files that have been added locally too
    exec('git -C ~/xns-local-storage clean -df', execCallback);

    // now pull down the latest
    exec('git -C ~/xns-local-storage pull -f', execCallback);

    // and npm install with --production
    exec('npm -C ~/xns-local-storage --production', execCallback);

    // and run tsc
    exec('tsc', execCallback);

    res.sendStatus(200);
});

app.post('/deploy', function (req, res) {

    console.log(req.body.pusher.name + ' just pushed to ' + req.body.repository.name);

	console.log('pulling code from GitHub...');

	// reset any changes that have been made locally
	exec('git -C ~/xns-local-storage reset --hard', execCallback);

	// and ditch any files that have been added locally too
	exec('git -C ~/xns-local-storage clean -df', execCallback);

	// now pull down the latest
	exec('git -C ~/xns-local-storage pull -f', execCallback);

	// and npm install with --production
	exec('npm -C ~/xns-local-storage --production', execCallback);

	// and run tsc
	exec('tsc', execCallback);

    res.sendStatus(200);
    res.end();

});

app.listen(5000, function () {
	console.log('listening on port 5000')
});

function execCallback(err, stdout, stderr) {
	if(stdout) console.log(stdout);
	if(stderr) console.log(stderr);
}