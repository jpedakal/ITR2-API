const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const webapi = require('./routes/api');

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', webapi);

const Port = process.env.PORT || 3000;
app.listen(Port, () => {
    console.log(`server running on port ${Port}`)
});