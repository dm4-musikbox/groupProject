const mongoose = require( 'mongoose' );
const Channel = require( "./Channel.js" );
const User = require( "./../user/User.js" );

const activeChannels = [];

module.exports = {
    subscribeToChannel( data, io, socket ) {
        const channelId = data.channelId;
        const userId = data.userId;
        User
            .findByIdAndUpdate( userId, { $addToSet: { userChannels: channelId } }, { new: true } )
            .populate( 'userChannels' )
            .exec( ( err, user ) => {
                if ( err ) {
                    throw err;
                }
                getUpdatedUser( io, userId, user );
            } );

        Channel
            .findByIdAndUpdate( channelId, { $addToSet: { members: userId } }, { new: true } )
            .populate( "channelRecordings channelMessages" )
            .exec( ( err, channel ) => {
                if ( err ) {
                    throw err;
                }
                getUpdatedChannel( io, channelId, channel );
            } );
    }
    , enterChannel( data, io, socket ) {
        console.log( 'enterChannel firing!' );
        const channelId = data.channelId;
        const userId = data.userId;

        socket.join( channelId );
        if ( activeChannels.length ) {
            for ( let i = 0; i < activeChannels.length; i++ ) {
                if ( activeChannels[ i ].channelId.toString() === channelId ) {
                  activeChannels[ i ].activeUsers.push( userId );
                  getChannelStatus( io, channelId, activeChannels[ i ] );
                }
                else {
                  activeChannels.push( {
                    channelId: channelId
                    , activeUsers: [ userId ]
                  } );
                  getChannelStatus( io, channelId, activeChannels[ activeChannels.length - 1 ] );
                }
            }
        }
        else {
            activeChannels.push( {
                channelId: channelId
                , activeUsers: [ userId ]
            } );
            getChannelStatus( io, channelId, activeChannels[ 0 ] );
        }
    }
    , leaveChannel( data, io, socket ) {
          console.log( 'leave channel firing!' );
          const channelId = data.channelId;
          const userId = data.userId;

          for ( let i = 0; i < activeChannels.length; i++ ) {
              if ( activeChannels[ i ].channelId.toString() === data.channelId ) {
                  let activeUserId = mongoose.Types.ObjectId( userId );
                  let activeUserIndex = activeChannels[ i ].activeUsers.indexOf( activeUserId );

                  activeChannels[ i ].activeUsers.splice( activeUserIndex, 1 );

                  if ( !activeChannels[ i ].activeUsers.length ) {
                      activeChannelId = mongoose.Types.ObjectId( channelId );
                      activeChannelIndex = activeChannels.indexOf( activeChannelId );
                      activeChannels.splice( activeChannelIndex, 1 );
                      getChannelStatus( io, channelId, { message: 'everyone has left the room.' } );
                  }
                  else {
                      getChannelStatus( io, channelId, activeChannels[ i ] );
                  }
              }
          }

          socket.leave( channelId );
    }
    , unsubscribeFromChannel( data, io, socket ) {
          const channelId = data.channelId;
          const userId = data.userId;

          User
              .findByIdAndUpdate( userId, { $pull: { userChannels: channelId } }, { new: true } )
              .populate( 'userChannels' )
              .exec( ( err, user ) => {
                  if ( err ) {
                      throw err;
                  }
                  getUpdatedUser( io, userId, user );
              } );

          Channel
              .findByIdAndUpdate( channelId, { $pull: { members: userId } }, { new: true } )
              .populate( "channelRecordings channelMessages" )
              .exec( ( err, channel ) => {
                  if ( err ) {
                      throw err;
                  }
                  getUpdatedChannel( io, channelId, channel );
              } );
    }
}

function updateUser( io, update, userId ) {
    User
        .findByIdAndUpdate( userId, update, { new: true } )
        .populate( 'userChannels' )
        .exec( ( err, user ) => {
            if ( err ) {
                throw err;
            }
            getUpdatedUser( io, userId, user );
        } );
}

function updateChannel( io, channelId, update ) {
    Channel
        .findByIdAndUpdate( channelId, update, { new: true } )
        .populate( "channelRecordings channelMessages" )
        .exec( ( err, channel ) => {
            if ( err ) {
                throw err;
            }
            getUpdatedChannel( io, channelId, channel );
        } );
}

function getUpdatedUser( io, userId, user ) {
    // io.to( userId ).emit( 'get user', user );
    io.emit( 'get user', user );
}

function getUpdatedChannel( io, channelId, channel ) {
    // io.to( channelId ).emit( 'get channel', channel );
    io.emit( 'get channel', channel );
}

function getChannelStatus( io, channelId, channelStatus ) {
    // io.to( channelId ).emit( 'get status of channel', channelStatus );
    io.emit( 'get status of channel', channelStatus );
}
