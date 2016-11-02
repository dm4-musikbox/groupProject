const userRoutes = require( "./features/user/userRoutes.js" );
const channelRoutes = require( "./features/channel/channelRoutes.js" );
const recordingRoutes = require( "./features/recording/recordingRoutes.js" );
const messageRoutes = require( "./features/message/messageRoutes.js" );
const genreRoutes = require( "./features/genre/genreRoutes.js" );

module.exports = ( app, io ) => {
	userRoutes( app, io );
	channelRoutes( app, io );
	messageRoutes( app, io );
	recordingRoutes( app, io );
	genreRoutes( app );
};
