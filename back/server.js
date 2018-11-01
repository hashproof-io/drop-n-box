// set up ======================================================================
const config     = require('./config/config');
const express    = require('express');
const timeout    = require('connect-timeout');
const http       = require('http');
const app        = express(); 			                        // create our app w/ express
const server     = http.createServer(app);                      // create http server
const io         = require('socket.io').listen(server);         // initialize web socket
const port  	 = process.env.PORT || 9080; 				    // set the port
const multer     = require('multer');                           // multipart form handler
const upload     = multer({dest: config.uploadsDir});
// const autoReap   = require('multer-autoreap');

const ApplicationService   = require('./service/application-service');

const service    = new ApplicationService();

const morgan = require('morgan'); 		                        // log requests to the console (express4)
const bodyParser = require('body-parser'); 	                    // pull information from HTML POST (express4)
const methodOverride = require('method-override');              // simulate DELETE and PUT (express4)

// configuration ===============================================================
app.use(timeout('40s'));                                                    // set default timeout for any http request
app.use(express.static(__dirname + '/public', {maxAge: 0, etag: false}));   // set the static files location /public/img will be /img for users
//app.use(morgan('common')); 										            // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'})); 			            // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); 									            // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));             // parse application/vnd.api+json as json
app.use(methodOverride());
app.use(upload.single('file'));                                             // set default name for uploads
// app.use(autoReap);                                                          // reap temporary files
app.use((req, res, next) => {if (!req.timedout) next(); });                 // set interruption after timeout ! this should be last in the chain

// routes ======================================================================
require('./routes.js')(app, service);
require('./websocket.js')(io, service);

// listen (start app with node server.js) ======================================
server.listen(port);
console.log("Express server listening on port " + port);
