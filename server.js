var http = require("http");
var fs = require("fs");
var qs = require("querystring");
var mongodb = require("mongodb");
var MongoClient = require("mongodb").MongoClient;
require("events").EventEmitter.prototype._maxListeners = 100;

var mongodbServer = new mongodb.Server("localhost", 27017, { auto_reconnect: true, poolSize: 10 });
var db = new mongodb.Db("database", mongodbServer);

var isTriedLogin = false, isLoginSuccessful = false, isUpdate = false;
var users, paw, favo, favo2, favo3;
var server = http.createServer(function(request, response) {
    if (request.method == "POST") {
		// Switch msg into a JSON object
        var formData = "", msg = "", obj = "";
        return request.on("data", function(data) {
			formData += data;
			return request.on("end", function() {
				var user;
				user = qs.parse(formData);
				msg = JSON.stringify(user);
				response.writeHead(200, {
				  "Content-Type": "application/json",
				  "Content-Length": msg.length
				});
				obj = JSON.parse(msg);
				// Prevent signup page runs this part
				if (request.url == "/signup.html") {
					console.log("GO");
					isTriedLogin = true;
					// Handle data received from login page
					console.log("OK");
					var username = obj.username;
					var password = obj.password;
					var favorite = obj.favorite;
					var favorite2 = obj.favorite2;
					var favorite3 = obj.favorite3;
					// Get data from database
					MongoClient.connect("mongodb://localhost:27017/database", function (err, db) {
						db.collection("user", function (err, collection) {
							collection.find().toArray(function(err, items) {
								if(err) throw err;
								// Check whether there is data in the database
								if (items != "") {
									// Check whether the user account exists
									for (var i=0; i<items.length; i++) {
										if (username == items[i].username && password == items[i].password) {
											console.log("Login successful");
											users = items[i].username;
											paw = items[i].password;
											favo = items[i].favorite;
											favo2 = items[i].favorite2;
											favo3 = items[i].favorite3;
											isLoginSuccessful = true;
										}
									}
								}
							});
						});	
					});
				}
				
				
				if(request.url== "/indexL.html") {
					if(obj.action =="logout") {
						isLoginSuccessful = false;
					}
					if(obj.favorite != null) {
						MongoClient.connect("mongodb://localhost:27017/database", function (err, db) {
							db.collection('user', function (err, collection) {
								collection.update({username: users}, { $set: { favorite: obj.favorite } }, {w:1}, function(err, result){
									if(err) throw err;    
									console.log('Document Updated Successfully');
									favo = obj.favorite;
								});
							});
						});
					}
					if(obj.favorite2 != null) {
						MongoClient.connect("mongodb://localhost:27017/database", function (err, db) {
							db.collection('user', function (err, collection) {
								collection.update({username: users}, { $set: { favorite2: obj.favorite2 } }, {w:1}, function(err, result){
									if(err) throw err;    
									console.log('Document Updated Successfully');
									favo2 = obj.favorite2;
								});
							});
						});
					}
					if(obj.favorite3 != null) {
						MongoClient.connect("mongodb://localhost:27017/database", function (err, db) {
							db.collection('user', function (err, collection) {
								collection.update({username: users}, { $set: { favorite3: obj.favorite3 } }, {w:1}, function(err, result){
									if(err) throw err;    
									console.log('Document Updated Successfully');
									favo3 = obj.favorite3;
								});
							});
						});
					}
				}
				
				if (request.url == "/favorite.html") {
					if(obj.do == "removeF1") {
						MongoClient.connect("mongodb://localhost:27017/database", function (err, db) {
							db.collection('user', function (err, collection) {
								collection.update({username: users}, { $set: { favorite: null } }, {w:1}, function(err, result){
									if(err) throw err;    
									console.log('Document Updated Successfully');
									favo = null;
								});
							});
						});
					}
					if(obj.do == "removeF2") {
						MongoClient.connect("mongodb://localhost:27017/database", function (err, db) {
							db.collection('user', function (err, collection) {
								collection.update({username: users}, { $set: { favorite2: null } }, {w:1}, function(err, result){
									if(err) throw err;    
									console.log('Document Updated Successfully');
									favo2 = null;
								});
							});
						});
					}
					if(obj.do == "removeF3") {
						MongoClient.connect("mongodb://localhost:27017/database", function (err, db) {
							db.collection('user', function (err, collection) {
								collection.update({username: users}, { $set: { favorite3: null } }, {w:1}, function(err, result){
									if(err) throw err;    
									console.log('Document Updated Successfully');
									favo3 = null;
								});
							});
						});
					}
				}
	
					
	
				/*if (request.url == "favorite.html") {
					if (obj.do == "remove_item") {
						
						// connect to database 
						
						// connect.xxx() --> remove favourite field
						
						// Check which user has signed in (variable/ for-loop)
						
					}
				}*/
				
				// Prevent login page runs this part
				if (obj.repassword != null) {
					// Send obj data to database
					db.open(function() {
						db.collection("user", function(err, collection) {
							collection.insert({
								username: obj.username,
								password: obj.password,
								favorite: obj.favorite,
								favorite2: obj.favorite2,
								favorite3: obj.favorite3
								//repassword: obj.repassword
							}, function(err, data) {
								if (data) {
									console.log("Successfully Insert");
								} else {
									console.log("Failed to Insert");
								}
							});
						});
					});
				}
				
				/*

				console.log(user.favorite);
				if (obj.favorite != null) {
					// Send obj data to database
					db.open(function() {
						db.collection("user", function(err, collection) {
							collection.insert({
								username: obj.username,
								password: obj.password,
								favorite: obj.favorite,
								favorite2: obj.favorite2,
								favorite3: obj.favorite3
								//repassword: obj.repassword
							}, function(err, data) {
								if (data) {
									console.log("Successfully Insert");
								} else {
									console.log("Failed to Insert");
								}
							});
						});
					});
				}
				console.log(user.favorite2);
				if (obj.favorite2 != null) {
					// Send obj data to database
					db.open(function() {
						db.collection("user", function(err, collection) {
							collection.insert({
								username: obj.username,
								password: obj.password,
								favorite: obj.favorite,
								favorite2: obj.favorite2,
								favorite3: obj.favorite3
								//repassword: obj.repassword
							}, function(err, data) {
								if (data) {
									console.log("Successfully Insert2");
								} else {
									console.log("Failed to Insert2");
								}
							});
						});
					});
				}
				console.log(user.favorite3);
				if (obj.favorite3 != null) {
					// Send obj data to database
					db.open(function() {
						db.collection("user", function(err, collection) {
							collection.insert({
								username: obj.username,
								password: obj.password,
								favorite: obj.favorite,
								favorite2: obj.favorite2,
								favorite3: obj.favorite3
								//repassword: obj.repassword
							}, function(err, data) {
								if (data) {
									console.log("Successfully Insert3");
								} else {
									console.log("Failed to Insert3");
								}
							});
						});
					});
				}*/
				return response.end();
			});
        });
    } else {
		// Get
		fs.readFile("./" + request.url, function (err, data) {
			var dotoffset = request.url.lastIndexOf(".");
			var mimetype = dotoffset == -1
				? "text/plain"
				: {
					".html": "text/html",
					".ico" : "image/x-icon",
					".jpg" : "image/jpeg",
					".png" : "image/png",
					".gif" : "image/gif",
					".css" : "text/css",
					".js"  : "text/javascript"
				}[request.url.substr(dotoffset)];
			if (!err) {
				response.setHeader("Content-Type", mimetype);
				response.end(data);
				console.log(request.url, mimetype);
			} else {
				response.writeHead(302, {"Location": "http://localhost:5000/index.html"});
				response.end();
			}
		});
    }
});

server.listen(5000);

console.log("Server running at http://127.0.0.1:5000/");

// IO is used to send message between server an client
var io = require("socket.io").listen(server);
	
function update() {
	if (isLoginSuccessful == true) {
		// Send message if login is successful
		io.emit("login_OK", { username: users, passwords: paw, favorite: favo, favorite2: favo2, favorite3: favo3 });

		
	} else {
		if (isTriedLogin == true) {
			io.emit("login_fail", { message: "Fail" });
			isTriedLogin = false;
		}
		else{

			io.emit("logout_successful",{message : "logout_successful"});
		}
	
	}
}
	
setInterval(update, 500);