const userRoutes = require( './user/userRoutes.js' );
const channelRoutes = require( './channel/channelRoutes.js' );

module.exports = app => {
  userRoutes( app );
  channelRoutes( app );
}
