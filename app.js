const http = require('http');
const https = require('https');
const request = require('request');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});


// Mock Call
https.get('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY', (resp) => {
  let data = '';

  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    console.log(JSON.parse(data).explanation);
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});

// Mock Call using `request`
const request = require('request')

request.post('https://flaviocopes.com/todos', {
  json: {
    todo: 'Buy the milk'
  }
}, (error, res, body) => {
  if (error) {
    console.error(error)
    return
  }
  console.log(`statusCode: ${res.statusCode}`)
  console.log(body)
})

// Vanilla `http` get request (too verbose)
function getLoginDetails(callback) {
return http.get({
        host: 'locatemap.in',
        path: '/userDetail'
    }, function(response) {
        // Continuously update stream with data
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {
// Data received, let us parse it using JSON!
            var parsed = JSON.parse(body);
            callback({
                userDetail: parsed.name,
                userId: parsed.Id
            });
        });
    });
},
