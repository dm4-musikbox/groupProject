const express = require( 'express' );
const { json } = require( 'body-parser' );
const mongoose = require( 'mongoose' );
const session = require( 'express-session' );
const sessionConfig = require( './server/config/config.js' );
const masterRoutes = require( './server/masterRoutes.js' );

const app = express();
const port = 5000;
const mongoUri = "mongodb://localhost:27017/groupProject";

app.use( json() );
app.use( express.static( `${ __dirname }/app` ) );
app.use( session ( sessionConfig ) );

mongoose.connect( mongoUri );
mongoose.connection.once( 'open', () => { console.log( `Connected to mongo db at ${ mongoUri }` ) } );

masterRoutes( app );

app.listen( port, () => console.log( `Listening on port ${ port }.` ) );
