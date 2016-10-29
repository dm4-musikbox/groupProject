const Message = require( "./Message" );
const Channel = require( "../channel/Channel" );

module.exports = {

  postMessage( req, res ){
      new Message( req.body ).save( ( err, message ) => {
        if( err ){
          console.log( err );
          return res.status( 500 ).json( err );
        }
        Channel.findByIdAndUpdate( req.params.channelId, { $push: { "channelMessages": message._id }  }, { new: true }, function( err, newChannel ) {
          console.log( "I am ", newChannel )
          if( err ){
            return res.status( 500 ).json( err )
          }
          return res.status( 200 ).json( newChannel )
      } );
    } );
  }
  , getMessages: function( req, res ){
    Message.find( {}, ( err, messages ) => {
      if( err ){
        return res.status( 500 ).json( err )
      }
      return res.status( 200 ).json( messages )
    })
  }
  , deleteMessage: function( req, res ){
    console.log( 'Message.findByIdAndRemove firing!' );
    Message.findByIdAndRemove( req.params.messageId, function( err, response ){
      if ( err ){
        return res.status( 500 ).json( err )
      }
      Channel.findByIdAndUpdate( req.params.channelId, { new: true }, function( error, newChannel ){
        if( error ){
          return res.status( 500 ).json( error )
        }
        for ( let i = 0; i < newChannel.channelMessages.length; i++ ) {
            if ( newChannel.channelMessages[ i ].toString() === req.params.messageId ) {
                newChannel.channelMessages.splice( i, 1 );
                return res.status( 200 ).json( newChannel )
            }
        }
      } )

    })
  }
  , updateMessage: function( req, res ){
    Message.findByIdAndUpdate( req.params.messageId, req.body, { new: true }, function( err, newMessage ){
      if( err ){
        return res.status( 500 ).json( err )
      }
      return res.status( 200 ).json( newMessage )
    })
  }
}
