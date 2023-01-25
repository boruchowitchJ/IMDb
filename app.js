const express = require('express');
const fs = require('fs');
let app = express();
app.use('/', express.static(__dirname + "/wwwRoot"));
app.set('view engine', 'index.html');
app.listen(8000, function () {
    console.log('Listening on port 8000')
})