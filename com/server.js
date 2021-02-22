//Human-Machine Interface (server)
var http = require('http').createServer(handler); //require http server, and create server with function handler()
var io = require('socket.io')(http) //require socket.io module and pass the http object (server)
var fs = require('fs'); //require filesystem module
http.listen(8080); //nasłuchuj port 8080
function handler(req, res) { //what to do on requests to port 8080
    fs.readFile(__dirname.replace('/com','') + '/index.html', function (err, data) { //read file index.html in public folder
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' }); //display 404 on error
            return res.end("404 Not Found");
        }
        res.writeHead(200, { 'Content-Type': 'text/html' }); //write HTML
        res.write(data); //write data from rgb.html
        return res.end();
    });
}

process.on('SIGINT', function () { //on ctrl+c
    process.exit(); //exit completely
});


module.exports = {
    http: http,
    io: io
}