const User = require( "./User.js" );

module.exports = {
    setIsUpdatedProp ( data, socket ) {
        // let user = data.user;
        let userType = data.userType;
        let channel = data.channel;
        let setTo = data.setTo;
        let queryObj;
        let updateObj;
        let userToSave;
        User.findOne( { _id: data.user._id }, ( err, user ) => {
          if ( userType === 'member' ) {
              console.log( 'in member' );
              for ( let i = 0; i < user.memberInChannels.length; i++ ) {
                  if ( setTo ) {
                      if ( channel._id.toString() === user.memberInChannels[ i ].channel._id.toString() ) {
                        user.memberInChannels[ i ].isUpdated = setTo;
                      }
                  }
                  else {
                      if ( channel._id.toString() === user.memberInChannels[ i ].channel._id.toString() ) {
                        user.memberInChannels[ i ].isUpdated = setTo;
                      }
                  }
              }
          }
          else if ( userType === 'admin' ) {
              console.log( 'in admin' );
              for ( let i = 0; i < user.adminInChannels.length; i++ ) {
                  if ( setTo ) {
                      if ( channel._id.toString() === user.adminInChannels[ i ].channel._id.toString() ) {
                        user.adminInChannels[ i ].isUpdated = setTo;
                      }
                  }
                  else {
                      if ( channel._id.toString() === user.adminInChannels[ i ].channel._id.toString() ) {
                        user.adminInChannels[ i ].isUpdated = setTo;
                      }
                  }
              }
          }
          else if ( userType === 'invitedAsMember' ) {
              console.log( 'in invitedAsMember' );
              for ( let i = 0; i < user.invitedAsMember.length; i++ ) {
                  if ( setTo ) {
                      if ( channel._id.toString() === user.invitedAsMember[ i ].channel._id.toString() ) {
                        user.invitedAsMember[ i ].isUpdated = setTo;
                      }
                  }
                  else {
                      if ( channel._id.toString() === user.invitedAsMember[ i ].channel._id.toString() ) {
                        user.invitedAsMember[ i ].isUpdated = setTo;
                      }
                  }
              }
          }
          else if ( userType === 'invitedAsAdmin' ) {
            console.log( 'in invitedAsAdmin', setTo );
            for ( let i = 0; i < user.invitedAsAdmin.length; i++ ) {
                if ( setTo ) {
                    if ( channel._id.toString() === user.invitedAsAdmin[ i ].channel._id.toString() ) {
                      user.invitedAsAdmin[ i ].isUpdated = setTo;
                    }
                }
                else if ( !setTo ){
                    console.log( 'false' );
                    if ( channel._id.toString() === user.invitedAsAdmin[ i ].channel._id.toString() ) {
                      console.log( channel._id.toString(), user.invitedAsAdmin[ i ].channel._id.toString() )
                      user.invitedAsAdmin[ i ].isUpdated = setTo;
                    }
                }
            }
          }

          userToSave = user;
          userToSave.save( ( err, user ) => {
            if ( socket ) {
                socket.emit( 'get user', user );
            }
            console.log( 'updated user is: ', user );
          } );
        } );
    }
};
