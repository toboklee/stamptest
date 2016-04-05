// adding dependencies
var express = require('express');
var instaSchema = require('./model/insta');
var http = require('http');
var https = require('https');
var router = express.Route();


// initialize instagram authentication.
// Access Token was obtained using separate curl.
var searchingTerm = 'toboklee';
var accessToken = '51383587.bd9662b.9e772b83394c4e83b9bdca41f44dc134';
var instagramAPI = 'https://api.instagram.com/v1/tags/' + searchingTerm + '/media/recent/?access_token=' + accessToken;

// express
var app = express();

// testing port: use 9000 or 8080
var port = 9000;

// establish connection with assigned port.
app.get('/', function(req, res){
	console.log('main page');
	res.send('hello world!\n');
	
	// Instagram GET.
	https.get(instagramAPI, function(res){
		console.log(res.statusCode);
		if (res.statusCode == 302) {
			// get re-direct url.
			console.log(res.headers.location);
		}
		if (res.statusCode == 200) {
			var body = '';
			res.on('data', function(partial){
      				body += partial;
    			});

    			res.on('end', function(){
        			var instaResponse = JSON.parse(body);
       				console.log("Insta response: ", instaResponse);

				for (var i = 0; i < instaResponse.data.length; i++) {
					console.log('init mongo saving');
					var post = new instaSchema(instaResponse.data[i]);
					console.log(post);

					//save model to MongoDB
					post.save(function (err) {
  						if (err) {
							console.log(err);
							return err;
  						} else {
  							console.log("Post saved");
 						}});				
				}
    			});
		}
	}).on('error', function(e){
      		console.log("Instagram http error: ", e);
	});
}).post('/', function(req, res){
	console.log('post');
});

// Instagram authentication.
app.route('/callback')
        .get(function(req,res) {
	  // instagram hub challenge.
	  // read instagram developer page for query details.
	  res.send(req.query['hub.challenge']);
	  
        });

app.listen(port);

console.log('listening to port', port);

