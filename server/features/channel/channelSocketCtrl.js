const mongoose = require( 'mongoose' );
const Channel = require( "./Channel.js" );
const User = require( "./../user/User.js" );

const activeChannels = [];

module.exports = {
    subscribeToChannel( data, io, socket ) {
        const channel_id = data.channel_id;
        const channelUpdate = { $push: { channelUsers: user_id } };
        const user_id = data.user_id;
        const userUpdate = { $push: { userChannels: channel_id } };

        updateUser( io, userUpdate, user_id );
        updateChannel( channel_id, io, channelUpdate );
    }
    , enterChannel( data, io, socket ) {
        const channel_id = data.channel_id;
        const user_id = data.user_id;

        socket.join( data.channel_id );
        for ( let i = 0; i < activeChannels.length; i++ ) {
            if ( activeChannels[ i ].channel_id.toString() === data.channel_id ) {
                activeChannels[ i ].activeUsers.push( data.channel_id );
                getChannelStatus( channel_id, io, activeChannels[ i ] );
            }
            else {
                activeChannels.push( {
                    channel_id: data.channel_id
                    , activeUsers: socket
                } );
                getChannelStatus( channel_id, io, activeChannels[ activeChannels.length - 1 ] );
            }
        }
    }
    , leaveChannel( data, io, socket ) {
          const channel_id = data.channel_id;
          const channelUpdate = { $pull: { channelUsers: user_id } };
          const user_id = data.user_id;

          socket.leave( channel_id );

          if ( activeChannels.length ) {
              for ( let i = 0; i < activeChannels.length; i++ ) {
                  if ( activeChannels[ i ].channel_id.toString() === data.channel_id ) {
                      let activeUserId = mongoose.Types.ObjectId( user_id );
                      let activeUserIndex = activeChannels[ i ].activeUsers.indexOf( activeUserId );

                      activeChannels[ i ].activeUsers.splice( activeUserIndex, 1 );
                      getChannelStatus( channel_id, io, activeChannels[ i ] );
                      updateChannel( channel_id, io, channelUpdate, user_id );
                  }
              }
          }
          else {
              activeChannelId = mongoose.Types.ObjectId( channel_id );
              activeChannelIndex = activeChannels.indexOf( activeChannelId );
              activeChannels.splice( activeChannelIndex );
          }
    }
    , unsubscribeFromChannel( data, io, socket ) {
          const channel_id = data.channel_id;
          const channelUpdate = { $pull: { channelUsers: user_id } };
          const user_id = data.user_id;
          const userUpdate = { $pull: { userChannels: channel_id } };

          updateUser( io, userUpdate, user_id );
          updateChannel( channel_id, io, channelUpdate );
    }
}

function updateUser( io, update, user_id ) {
    User
        .findByIdAndUpdate( user_id, update, { new: true } )
        .populate( 'userChannels' )
        .exec( ( err, user ) => {
            if ( err ) {
                throw err;
            }
            getUpdatedUser( user_id, io, user );
        } );
}

function updateChannel( channel_id, io, update ) {
    Channel
        .findByIdAndUpdate( channel_id, update, { new: true } )
        .populate( "channelRecordings channelMessages" )
        .exec( ( err, channel ) => {
            if ( err ) {
                throw err;
            }
            getUpdatedChannel( channel_id, io, channel );
        } );
}

function getUpdatedUser( user_id, io, user ) {
    io.to( user_id ).emit( 'get updated user', user );
}

function getUpdatedChannel( channel_id, io, channel ) {
    io.to( channel_id ).emit( 'get updated channel', channel );
}

function getChannelStatus( channel_id, io, channelStatus ) {
    io.to( channel_id ).emit( 'get channel status', channelStatus );
}
