const channelCtrl = require( './channelCtrl.js' );

module.exports = app => {
  app.get( '/api/channels', channelCtrl.getChannels );
  app.get( '/api/channels/:id', channelCtrl.getChannelById );
  app.put( '/api/channels/:id', channelCtrl.updateChannel );
  app.delete( '/api/channels/:id', channelCtrl.deleteChannel );

}
