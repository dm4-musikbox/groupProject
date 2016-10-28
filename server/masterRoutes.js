const userRoutes = require( './features/user/userRoutes.js' );
const channelRoutes = require( './features/channel/channelRoutes.js' );

module.exports = app => {
  userRoutes( app );
  channelRoutes( app );
}
