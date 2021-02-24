//___________ Libraries ___________
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const path = require('path')
//___________ Configuration ___________
const PORT = process.env.PORT || 8080
const PATH = __dirname + '/views'
app.set('views', PATH);
app.set('view engine', 'hbs')
app.use(express.static(path.join(__dirname, 'public')));
//___________ My files ___________
const routes = require('./routes/index')
//___________ Parsers ___________
app.use(bodyParser.json())
app.use(bodyParser.raw());
app.use(bodyParser.urlencoded({ extended: true }));
//___________ Routes ___________
app.use('/', routes)

app.listen(PORT)