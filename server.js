const express = require( "express" );
const { json } = require( "body-parser" );
const mongoose = require( "mongoose" );
const session = require( "express-session" );
const http = require( "http" );
const binaryServer = require( "binaryjs" ).BinaryServer( { port: 9000 } );
const masterRoutes = require( "./server/masterRoutes.js" );
// const sessionConfig = require( "./server/config/sessionConfig.js" );
const mongoUri = require( "./server/config/mlab-config.js" ).mongoUri;

const app = express();
const server = http.createServer( app );
const io = require( "socket.io" ).listen( server );
const port = 5000;

app.use( json() );
app.use( express.static( `${ __dirname }/dist` ) );
app.use( express.static( "server/user-audio-previews" ) );
// app.use( session( sessionConfig ) );

mongoose.connect( mongoUri );
mongoose.connection.once( "open", () => {
	console.log( `Connected to MongoDB at ${ mongoUri }` );
} );

masterRoutes( app, binaryServer, io );

server.listen( port, () => console.log( `Listening on port ${ port }` ) );
