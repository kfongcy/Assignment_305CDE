var MongoClient = require('mongodb').MongoClient;

// Connect to the db
MongoClient.connect("mongodb://localhost:27017/database", function (err, db) {
    
    db.collection('user', function (err, collection) {
        
         collection.remove({});
		 console.log("All records have been removed. ");
        
    });
                
});