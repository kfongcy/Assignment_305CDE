var MongoClient = require('mongodb').MongoClient;

// Connect to the db
MongoClient.connect("mongodb://localhost:27017/database", function (err, db) {
    
    db.collection('user', function (err, collection) {
        
        collection.update({username: "sss"}, { $set: { favorite: "OK" } }, {w:1},
                                                     function(err, result){
                                                                if(err) throw err;    
                                                                console.log('Document Updated Successfully');
                                                        });
/*
        collection.remove({id:2}, {w:1}, function(err, result) {
        
            if(err) throw err;    
        
            console.log('Document Removed Successfully');
        });
*/
    });
                
});