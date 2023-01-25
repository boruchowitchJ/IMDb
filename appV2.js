const express = require('express');
const fs = require('fs');
let app = express();


const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://127.0.0.1:27017/';

app.use('/', express.static(__dirname + "/wwwRoot"));
app.set('view engine', 'index.html');

app.listen(8000, function () {
    console.log('Listening on port 8000')
})

app.get('/movies', function (request, response) {

    MongoClient.connect(url, { useNewUrlParser: true },

        function (err, dbMongo) {
            if (err) console.log(err);
            console.log("Connected correctly to server.");
            const dbMovies = dbMongo.db("Movies");
            dbMovies.collection("IMDB").find({}).toArray(
                function (err, resultjs) {
                    let startIndex = 1;
                    if (request.query.start) {
                        startIndex = parseInt(request.query.start);
                    } 
                    let prev = startIndex - 10;
                    if (prev <= 0) prev = 1;
                    
                    let next = startIndex + 10;
                    if (next <= (resultjs.length) - 10) next = ((resultjs.length)) - 9;


                    let datatoEJS = {
                        result: resultjs.slice(startIndex - 1, startIndex + 9),
                        maxIndex: (resultjs.length) - 9,
                        prev: prev,
                        next: next
                    }

                    response.setHeader('Content-Type', 'text/html');
                    response.render('movieList.ejs', datatoEJS);
                });
        });


});