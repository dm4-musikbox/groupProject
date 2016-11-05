const channelCtrl = require( "./channelCtrl.js" );

module.exports = app => {
	app.route( "/api/channels" )
				.get( channelCtrl.getChannels )
				.post( channelCtrl.findOrCreateChannel );

	app.route( "/api/channels/:channel_id" )
				.get( channelCtrl.getChannelById )
				.put( channelCtrl.updateChannel )
				.delete( channelCtrl.deleteChannel );

	app.route( "/api/channels/:channel_id/genres/:genre" )
				.put( channelCtrl.addGenreToChannel )
				.delete( channelCtrl.deleteGenreFromChannel );
};
