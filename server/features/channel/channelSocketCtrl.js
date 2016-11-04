const mongoose = require( 'mongoose' );
const Channel = require( "./Channel.js" );
const User = require( "./../user/User.js" );

const activeChannels = {};

module.exports = {
    enterChannel( data, io, socket ) {
        console.log( 'enterChannel firing!' );

        const channelId = data.channelId;
        const userName = data.userName;
        let channelStatus;

        socket.join( channelId );

        if ( activeChannels.hasOwnProperty( channelId ) ) {
            activeChannels[ channelId ][ userName ] = socket;
            channelStatus = {
                channelId: channelId
                , users: Object.keys( activeChannels[ channelId ] )
            };
        }
        else {
            activeChannels[ channelId ] = { [ userName ]: socket };
            channelStatus = {
                channelId: channelId
                , activeUsers: Object.keys( activeChannels[ channelId ] )
            };
        }
        getChannelStatus( io, channelId, channelStatus );
    }
    , leaveChannel( data, io, socket ) {
          console.log( 'leaveChannel firing!' );
          const channelId = data.channelId;
          const userName = data.userName;

          if ( activeChannels.hasOwnProperty( channelId ) ) {
              delete activeChannels[ channelId ][ userName ];

              if ( !Object.keys( activeChannels[ channelId ] ).length ) {
                  delete activeChannels[ channelId ];
                  getChannelStatus( io, channelId, { message: 'everyone has left the room.' } );
              }
              else {
                  let channelStatus = {
                      channelId: channelId
                      , activeUsers: Object.keys( activeChannels[ channelId ] )
                  };
                  getChannelStatus( io, channelId, channelStatus );
              }

          }
          socket.leave( channelId );
    }
    , subscribeToChannel( data, io, socket ) {
        console.log( 'subscribeToChannel firing!' );

        const channelId = data.channelId;
        const userId = data.userId;

        User
            .findByIdAndUpdate( userId, { $addToSet: { userChannels: channelId } }, { new: true } )
            .populate( 'userChannels' )
            .exec( ( err, user ) => {
                if ( err ) {
                    throw err;
                }
                getUpdatedUser( socket, userId, user );
            } );

        Channel
            .findByIdAndUpdate( channelId, { $addToSet: { members: userId } }, { new: true } )
            .populate( "members admins channelRecordings channelMessages" )
            .exec( ( err, channel ) => {
                if ( err ) {
                    throw err;
                }
                getUpdatedChannel( io, channelId, channel );
            } );
    }
    , unsubscribeFromChannel( data, io, socket ) {
          console.log( 'unsubscribeFromChannel firing!' );

          const channelId = data.channelId;
          const userId = data.userId;

          User
              .findByIdAndUpdate( userId, { $pull: { userChannels: channelId } }, { new: true } )
              .populate( 'userChannels' )
              .exec( ( err, user ) => {
                  if ( err ) {
                      throw err;
                  }
                  getUpdatedUser( io, socket, userId, user );
              } );

          Channel
              .findByIdAndUpdate( channelId, { $pull: { members: userId } }, { new: true } )
              .populate( "members admins channelRecordings channelMessages" )
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
            getUpdatedUser( io, socket, userId, user );
        } );
}

function getUpdatedUser( io, socket, userId, user ) {
    io.to( socket.id ).emit( 'get user', user );
    // io.emit( 'get user', user );
}

function getUpdatedChannel( io, channelId, channel ) {
    io.to( channelId ).emit( 'get channel', channel );
    // io.emit( 'get channel', channel );
}

function getChannelStatus( io, channelId, channelStatus ) {
    io.to( channelId ).emit( 'get status of channel', channelStatus );
    // io.emit( 'get status of channel', channelStatus );
}
