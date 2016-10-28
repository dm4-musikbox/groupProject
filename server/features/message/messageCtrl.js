const Message = require( "./Message" );
const Channel = require( "../channel/Channel" );


module.exports = {

  postMessage: function( req, res ){
    new Message( req.body ).save( ( err, message) => {
      if( err ){
        return res.status( 500 ).json( err );
      }
      Channel.findByIdAndUpdate( req.params.channelId, { $push: { "messages": message._id }  }, { new: true }, function( err, newChannel ) ){
        if( err ){
          return res.status( 500 ).json( err )
        }
        return res.status( 200 ).json( newChannel )
      }
    }
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
    Message.findByIdAndRemove( req.params.messageId, function( err, res ){
      if ( err ){
        return res.status( 500 ).json( err )
      }
      return res.status( 200 ).json( res )
    })
  }
  , updateMessage: function( req, res ){
    Message.findByIdAndUpdate( req.params.messageId, req.body, { new: true } function( err, newMessage ){
      if( err ){
        return res.status( 500 ).json( err )
      }
      return res.status( 200 ).json( newMessage )
    })
  }
