var express = require('express');
var Request = require('request');
var bodyParser = require('body-parser');

var app = express();

// Set up the public directory to serve our Javascript file
app.use("/js", express.static(__dirname + '/public/js'));
app.use("/css", express.static(__dirname + '/public/css'));
app.use("/media", express.static(__dirname + '/public/media'));
app.use("/lib", express.static(__dirname + '/lib'));

// Set EJS as templating language
app.set('views', __dirname + '/views');
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');

// Enable json body parsing of application/json
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var CLOUDANT_USERNAME="stasdfr";
// The name of your database
var CLOUDANT_DATABASE="mashups_box2d";
// These two are generated from your Cloudant dashboard of the above database.
var CLOUDANT_KEY="andrestedeentandembefore";
var CLOUDANT_PASSWORD="6dd7b44412de3721db2772396b48d5751ad0f87f";

var CLOUDANT_URL = "https://" + CLOUDANT_USERNAME + ".cloudant.com/" + CLOUDANT_DATABASE;

// GET - route to load the main page
app.get("/", function (req, res) {
	console.log("In main route");
	res.render("index");
});

app.get("/favorites", function(req, res) {
	console.log("In fav");
	res.render("fav");
});

// POST - route to create a new meme.
app.post("/post", function (request, response) {

	console.log("Making a post!");
	// Use the Request lib to POST the data to the CouchDB on Cloudant
	Request.post({
		url: CLOUDANT_URL,
		auth: {
			user: CLOUDANT_KEY,
			pass: CLOUDANT_PASSWORD
		},
		json: true,
		body: request.body
	},
	function (err, res, body) {
		if (res.statusCode == 201){
			console.log('Doc was saved!');
			response.json(body);
		}
		else{
			console.log('Error: '+ res.statusCode);
			console.log(body);
		}
	});

});

app.get("/api/favorites", function(req, res) {

	console.log('Making a db request for fav entries');
	//Use the Request lib to GET the data in the CouchDB on Cloudant
	Request.get({
		url: CLOUDANT_URL + "/_all_docs?include_docs=true",
		auth: {
			user: CLOUDANT_KEY,
			pass: CLOUDANT_PASSWORD
		},
		json: true
	},
	function (error, response, body){
		// console.log(body.rows);
		var theRows = body.rows;
		//Send the data
		res.json(theRows);
	});

});

//Get - route to update meme. 
app.get("/get/:key/:text/:text1", function(request, response) {

	var id = request.params.key;
	var text = request.params.text;
	var text1 = request.params.text1;
	console.log(text1);

	var baseUrl = "https://api.imgflip.com/caption_image?";
	var memeID = id;
	var username = "adffdsaf";
	var password = "Cynthia0206";
	var topText = text;
	var bottomText = text1;

	var postUrl = baseUrl + "template_id=" + memeID + "&username=" + username + "&password=" + password + "&text0=" + topText + "&text1=" + bottomText;
	console.log(postUrl);

	Request.get({
		url: postUrl,
		json: true
	}, 
	function (err, res, body){
		//Grab the rows
		var theData = body.data.url;
		console.log(theData);

		if (res) {	
			response.json(theData);
		} else {
			response.json({noData:true});
		}
	});

});


//Catch all 
app.get("*", function(req,res){
	res.redirect("/");
});

var port = process.env.PORT || 3000; 
app.listen(port);
console.log('Express started on port ' + port);
