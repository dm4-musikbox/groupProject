const channelCtrl = require( "./channelCtrl.js" );
const channelSocketCtrl = require( "./channelSocketCtrl.js" );

module.exports = ( app, io ) => {
		app.route( "/api/channels" )
				.get( channelCtrl.getChannels )
				.post( channelCtrl.findOrCreateChannel );

		app.route( "/api/channels/:channel_id" )
				.get( channelCtrl.getChannelById )
				.put( channelCtrl.updateChannel )
				.delete( channelCtrl.deleteChannel );

		app.route( '/api/channels/:channel_id/genres/:genre' )
				.put( channelCtrl.addGenreToChannel )
				.delete( channelCtrl.deleteGenreFromChannel );

		io.on( 'connection', socket => {
				socket.on( 'create channel', ( data ) => {
						// channelSocketCtrl.createChannel( data, io );
				} );

				socket.on( 'delete channel', ( data ) => {
						// channelSocketCtrl.deleteChannel( data, io );
				} );

				socket.on( 'update channel', ( data ) => {
						// channelSocketCtrl.updateChannel( data, io );
				} );

				socket.on( 'subscribe to channel', ( data ) => {
						channelSocketCtrl.subscribeToChannel( data, io, socket );
				} );

				socket.on( 'enter channel', ( data ) => {
						channelSocketCtrl.enterChannel( data, io, socket );
				} );

				socket.on( 'leave channel', ( data ) => {
						channelSocketCtrl.leaveChannel( data, io, socket );
				} );

				socket.on( 'unsubscribe from channel', ( data ) => {
						channelSocketCtrl.unsubscribeFromChannel( data, io, socket );
				} );

		} );
};
