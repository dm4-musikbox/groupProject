const mongoose = require( 'mongoose' );
const Channel = require( "./Channel.js" );
const User = require( "./../user/User.js" );

const activeChannels = [];

module.exports = {
    subscribeToChannel( data, io, socket ) {
        const channel_id = data.channel_id;
        const user_id = data.user_id;
        User
            .findByIdAndUpdate( user_id, { $addToSet: { userChannels: channel_id } }, { new: true } )
            .populate( 'userChannels' )
            .exec( ( err, user ) => {
                if ( err ) {
                    throw err;
                }
                getUpdatedUser( io, user_id, user );
            } );

        Channel
            .findByIdAndUpdate( channel_id, { $addToSet: { members: user_id } }, { new: true } )
            .populate( "channelRecordings channelMessages" )
            .exec( ( err, channel ) => {
                if ( err ) {
                    throw err;
                }
                getUpdatedChannel( io, channel_id, channel );
            } );
    }
    , enterChannel( data, io, socket ) {
        console.log( 'enterChannel firing!' );
        const channel_id = data.channel_id;
        const user_id = data.user_id;

        socket.join( channel_id );
        if ( activeChannels.length ) {
            for ( let i = 0; i < activeChannels.length; i++ ) {
                if ( activeChannels[ i ].channel_id.toString() === channel_id ) {
                  activeChannels[ i ].activeUsers.push( user_id );
                  getChannelStatus( io, channel_id, activeChannels[ i ] );
                }
                else {
                  activeChannels.push( {
                    channel_id
                    , activeUsers: [ user_id ]
                  } );
                  getChannelStatus( io, channel_id, activeChannels[ activeChannels.length - 1 ] );
                }
            }
        }
        else {
            activeChannels.push( {
                channel_id
                , activeUsers: [ user_id ]
            } );
            getChannelStatus( io, channel_id, activeChannels[ 0 ] );
        }
    }
    , leaveChannel( data, io, socket ) {
          console.log( 'leave channel firing!' );
          const channel_id = data.channel_id;
          const user_id = data.user_id;

          for ( let i = 0; i < activeChannels.length; i++ ) {
              if ( activeChannels[ i ].channel_id.toString() === data.channel_id ) {
                  let activeUserId = mongoose.Types.ObjectId( user_id );
                  let activeUserIndex = activeChannels[ i ].activeUsers.indexOf( activeUserId );

                  activeChannels[ i ].activeUsers.splice( activeUserIndex, 1 );

                  if ( !activeChannels[ i ].activeUsers.length ) {
                      activeChannelId = mongoose.Types.ObjectId( channel_id );
                      activeChannelIndex = activeChannels.indexOf( activeChannelId );
                      activeChannels.splice( activeChannelIndex, 1 );
                      getChannelStatus( io, channel_id, { message: 'everyone has left the room.' } );
                  }
                  else {
                      getChannelStatus( io, channel_id, activeChannels[ i ] );
                  }
              }
          }

          socket.leave( channel_id );
    }
    , unsubscribeFromChannel( data, io, socket ) {
          const channel_id = data.channel_id;
          const user_id = data.user_id;

          User
              .findByIdAndUpdate( user_id, { $pull: { userChannels: channel_id } }, { new: true } )
              .populate( 'userChannels' )
              .exec( ( err, user ) => {
                  if ( err ) {
                      throw err;
                  }
                  getUpdatedUser( io, user_id, user );
              } );

          Channel
              .findByIdAndUpdate( channel_id, { $pull: { members: user_id } }, { new: true } )
              .populate( "channelRecordings channelMessages" )
              .exec( ( err, channel ) => {
                  if ( err ) {
                      throw err;
                  }
                  getUpdatedChannel( io, channel_id, channel );
              } );
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
            getUpdatedUser( io, user_id, user );
        } );
}

function updateChannel( io, channel_id, update ) {
    Channel
        .findByIdAndUpdate( channel_id, update, { new: true } )
        .populate( "channelRecordings channelMessages" )
        .exec( ( err, channel ) => {
            if ( err ) {
                throw err;
            }
            getUpdatedChannel( io, channel_id, channel );
        } );
}

function getUpdatedUser( io, user_id, user ) {
    io.to( user_id ).emit( 'get user', user );
}

function getUpdatedChannel( io, channel_id, channel ) {
    io.to( channel_id ).emit( 'get channel', channel );
}

function getChannelStatus( io, channel_id, channelStatus ) {
    io.to( channel_id ).emit( 'get status of channel', channelStatus );
}
