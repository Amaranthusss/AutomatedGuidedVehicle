//___________ Libraries ___________
const fs = require('fs')
const key = fs.readFileSync('./key.pem')
const cert = fs.readFileSync('./cert.pem')
const express = require('express')
const https = require('https')
const bodyParser = require('body-parser')
const app = express()
const path = require('path')
//___________ Configuration ___________
const server = https.createServer({ key: key, cert: cert }, app)
const port = require('../config/config').SERVER.PORT
const PORT = process.env.PORT || port
app.set('views', path.join(__dirname, '..', 'frontend', 'build'))
app.set('view engine', 'hbs')
app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')))
//___________ My files ___________
const routes = require('./routes/index')
//___________ Parsers ___________
app.use(bodyParser.json())
app.use(bodyParser.raw());
app.use(bodyParser.urlencoded({ extended: true }));
//___________ Routes ___________
app.use('/', routes)

server.listen(PORT, () => { console.log(`Listening server at port [${PORT}]`) })