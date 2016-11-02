module.exports = io => {
    io.on( 'connection', socket => {
        // on user wanting to create channel, create channel
        socket.on( 'create channel', ( channelName ) => {
            console.log( `Channel ${ channelName } was created` );
            // create channel document in database
            socket.join( channelName );
        } );

        // on user wanting to enter existing channel, connect them to existing channel
        socket.on( 'join channel', ( channelName ) => {
            console.log( `Channel ${ channelName } was joined` );
            socket.join( channelName );
        } )

        // on receiving message, store message in database
        socket.on( 'send message', ( message ) => {
            console.log( 'Received message', message );
            io.sockets.emit( 'get message', message );
            // store message in database
        } );

        // on receiving recording, upload recording to cloud, then store recording object with url in database
        socket.on( 'save recording', ( recording ) => {
            console.log( 'Recording-to-save received ', recording );
        } );

        // on posting recording, copy recording object and broadcast only to target channel
        socket.on( 'post recording', ( recording ) => {
            console.log( 'Recording-to-post received ', recording );
        } );
    } );
};
