//___________ Libraries ___________
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const path = require('path')
//___________ Configuration ___________
const PORT = process.env.PORT || 8080
app.set('views', path.join(__dirname, '..', 'frontend', 'build'));
app.set('view engine', 'hbs')
app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));
//___________ My files ___________
const routes = require('./routes/index')
//___________ Parsers ___________
app.use(bodyParser.json())
app.use(bodyParser.raw());
app.use(bodyParser.urlencoded({ extended: true }));
//___________ Routes ___________
app.use('/', routes)

app.listen(PORT)