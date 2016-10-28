const userRoutes = require( "./features/user/userRoutes.js" );
const channelRoutes = require( "./features/channel/channelRoutes.js" );
const recordingRoutes = require( "./features/recording/recordingRoutes.js" );

module.exports = app => {
	userRoutes( app );
	channelRoutes( app );
	recordingRoutes( app );
};
