var express = require('express');

// Create our app
var app = express();

app.use(express.static('docs'));

app.listen(3000, function () {
  console.log('Express server is up on port 3000');
});
