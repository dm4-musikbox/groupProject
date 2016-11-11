const channelCtrl = require( "./channelCtrl.js" );
const channelSocketCtrl = require( "./channelSocketCtrl.js" );

module.exports = ( app, io ) => {
	app.route( "/api/channels" )
				.get( channelCtrl.getPublicChannels )
				.post( channelCtrl.createChannel );

	app.route( "/api/channels/:channel_id" )
				.get( channelCtrl.getChannelById )
				.put( channelCtrl.updateChannel )
				.delete( channelCtrl.deleteChannel );

	app.route( "/api/channels/:channel_id/genres/:genre" )
				.put( channelCtrl.addGenreToChannel )
				.delete( channelCtrl.deleteGenreFromChannel );

	io.on( "connection", socket => {
		socket.on( "create channel", ( data ) => {
            // channelSocketCtrl.createChannel( data, io );
		} );

		socket.on( "delete channel", ( data ) => {
      channelSocketCtrl.deleteChannel( data, io );
		} );

		socket.on( "enter channel", ( data ) => {
			channelSocketCtrl.enterChannel( data, io, socket );
		} );

		socket.on( "leave channel", ( data ) => {
			channelSocketCtrl.leaveChannel( data, io, socket );
		} );

		socket.on( "add user to channel", ( data ) => {
			channelSocketCtrl.addUserToChannel( data, io, socket );
		} );

		socket.on( "remove user from channel", ( data ) => {
			channelSocketCtrl.removeUserFromChannel( data, io, socket );
		} );
	} );
};
