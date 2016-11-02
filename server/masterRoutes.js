const userRoutes = require( "./features/user/userRoutes.js" );
const channelRoutes = require( "./features/channel/channelRoutes.js" );
const recordingRoutes = require( "./features/recording/recordingRoutes.js" );
const messageRoutes = require( "./features/message/messageRoutes.js" );

module.exports = ( app, io ) => {
	userRoutes( app );
	channelRoutes( app );
	recordingRoutes( app, io );
	messageRoutes( app );
};
