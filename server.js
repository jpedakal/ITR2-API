const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const webapi = require('./routes/api');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// added middleware routes
app.use('/', webapi);

// new start server
const Port = process.env.PORT || 3000;
app.listen(Port, () => {
    console.log(`server running on port ${Port}`)
});