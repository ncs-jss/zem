const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const compression = require('compression');
const path = require('path');

require('./config');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.mongoURI);
mongoose.set('debug', process.env.NODE_ENV === 'development');

require('./models/Event');

const app = express();

app.use(compression());
app.use(morgan('dev'));

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

require('./routes')(app);

app.use(express.static('client'));

app.listen(process.env.port, () => {
  console.log(`app listening on port ${process.env.port}`);
});
