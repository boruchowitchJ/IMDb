const express = require('express');
const fs = require('fs');
let app = express();

const MongoClient = require('mongodb').MongoClient;
const mongo = require("mongodb")

const url = 'mongodb://127.0.0.1:27017/';

app.use('/', express.static(__dirname + "/wwwRoot")); //pour poster dans un document
app.set('view engine', 'index.html');
app.use(express.urlencoded({ extended: false })); //pour recupere des informations
app.use(express.json());

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
                    if (next >= resultjs.length - 10) next = resultjs.length - 10;
                    let datatoEJS = {
                        result: resultjs.slice(startIndex - 1, startIndex + 9),
                        prev: prev,
                        next: next,
                        maxIndex: resultjs.length - 9
                    };
                    response.setHeader('Content-Type', 'text/html');
                    response.render('movieList.ejs', datatoEJS);
                });
        });


});

app.get('/movies/:id', function (request, response) {
    console.log((request.params.id).substring(1));

    MongoClient.connect(url, { useNewUrlParser: true },

        function (err, dbMongo) {
            if (err) console.log(err);
            console.log("Connected correctly to server.");
            const dbMovies = dbMongo.db("Movies");
            const query = { _id: mongo.ObjectId((request.params.id).substring(1)) }
            dbMovies.collection("IMDB").find(query).toArray(
                function (err, result) {

                    response.setHeader('Content-Type', 'text/json');
                    response.send(result);
                    console.log(result)
                });
        })
});

app.get('/edit/:id', function (request, response) {
    console.log((request.params.id).substring(1));

    MongoClient.connect(url, { useNewUrlParser: true },

        function (err, dbMongo) {
            if (err) console.log(err);
            console.log("Connected correctly to server.");
            const dbMovies = dbMongo.db("Movies");
            const query = { _id: mongo.ObjectId((request.params.id).substring(1)) }
            dbMovies.collection("IMDB").find(query).toArray(
                function (err, result) {

                    response.setHeader('Content-Type', 'text/html');
                    response.render('moviesEdit.ejs', result[0]);
                });
        })
});

app.delete('/movies/:id', function (request, response) {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true },
        function (err, dbMongo) {
            const dbMovies = dbMongo.db("Movies");
            const query = { _id: mongo.ObjectID(request.params.id.replace(":", "")) };
            dbMovies.collection("IMDB").deleteOne(query,
                function (err, result) {
                    if (err) throw err;
                    response.send('deleted');
                });
        });
});

app.post('/movies', function (request, response) {
    console.log(request.body.Series_Title);
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true },
        function (err, dbMongo) {
            const dbMovies = dbMongo.db("Movies");
            let newMovie = { Series_Title: request.body.Series_Title,
                Released_Year: request.body.Released_Year,  
                Runtime: request.body.Runtime, 
                Director: request.body.Director,
                 Genre: request.body.Genre, 
                 Overview: request.body.Overview, 
                 Poster_Link: request.body.Poster_Link
                 };
            dbMovies.collection("IMDB").insertOne(newMovie,
                function (err, res) {
                    if (err) throw err;
                    console.log("1 document inserted");
                });
        });
    response.redirect('/movies')
});
app.put('/movies/:id', function (request, response) {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true },
        function (err, dbMongo) {
            if (err) throw err;
            const dbMovies = dbMongo.db("Movies");
            const query = { _id: mongo.ObjectID(request.params.id.replace(":", "")) };
            let newvalues = { $set:{Series_Title: request.body.Series_Title,
                Released_Year: request.body.Released_Year, 
                Runtime: request.body.Runtime, 
                Director: request.body.Director, 
                Genre: request.body.Genre, 
                Overview: request.body.Overview, 
                Poster_Link: request.body.Poster_Link 
            }};
            dbMovies.collection("IMDB").updateOne(query, newvalues,
                function (err, res) {
                    if (err) throw err;
                    console.log("1 document updated");
                });
        });
    response.send('Item Modified');
});