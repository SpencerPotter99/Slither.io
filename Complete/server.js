let http = require('http'),
    path = require('path'),
    fs = require('fs'),
    game = require('./scripts/server/game');

let mimeTypes = {
        '.js' : 'text/javascript',
        '.html' : 'text/html',
        '.css' : 'text/css',
        '.png' : 'image/png',
        '.jpg' : 'image/jpeg',
        '.mp3' : 'audio/mpeg3',
        '.map' : 'application/json',
        '.map' : 'application/octet-stream' // Chrome is requesting socket.io;'s source map file
    };

function handleRequest(request, response) {
    let lookup = (request.url === '/') ? '/index.html' : decodeURI(request.url);
    let file = lookup.substring(1, lookup.length);

    fs.access(file, fs.constants.R_OK, function(err) {
        if (!err) {
            fs.readFile(file, function(error, data) {
                if (error) {
                    response.writeHead(500);
                    response.end('Server Error!');
                } else {
                    let headers = {'Content-type': mimeTypes[path.extname(lookup)]};
                    response.writeHead(200, headers);
                    response.end(data);
                }
            });
        } else {
            response.writeHead(404);
            response.end();
        }
    });
}

let server = http.createServer(handleRequest);

server.listen(3000, function() {
    game.initialize(server);
    console.log('Server is listening on port 3000');
});
