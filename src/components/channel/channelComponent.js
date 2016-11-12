import channelViewHtml from "./channel-view-tmpl.html";
import "./styles/channel.scss";

function channelCtrl( $scope, $state, messageService, socketFactory, channelService ) {
  this.$onInit = () => {
      if ( this.channel ) {
          this.enterChannel();
          this.isUserMember = false;
          this.isUserAdmin = false;
          this.isUserChannelCreator = false;
          this.isUserMemberInvite = false;
          this.isUserAdminInvite = false;
          this.isUserAnon = true;

          for ( let i = 0; i < this.channel.members.length; i++ ) {
              if ( this.channel.members[ i ]._id === this.user._id ) {
                  this.isUserMember = true;
                  this.isUserAnon = false;
              }
          }

          for ( let i = 0; i < this.channel.admins.length; i++ ) {
              if ( this.channel.admins[ i ]._id === this.user._id ) {
                  this.isUserAdmin = true;
                  this.isUserAnon = false;
              }
          }

          for ( let i = 0; i < this.channel.invitedAsMember.length; i++ ) {
              if ( this.channel.invitedAsMember[ i ] === this.user._id ) {
                  this.isUserMemberInvite = true;
                  this.isUserAnon = false;
              }
          }

          for ( let i = 0; i < this.channel.invitedAsAdmin.length; i++ ) {
              if ( this.channel.invitedAsAdmin[ i ] === this.user._id ) {
                  this.isUserAdminInvite = true;
                  this.isUserAnon = false;
              }
          }

          if ( this.channel.createdBy._id === this.user._id ) {
              this.isUserChannelCreator = true;
              this.isUserAnon = false;
          }

          if ( this.channel.type === 'private' && this.isUserAnon === true ) {
              console.log( 'You do not have access to this channel.' );
              $state.go( 'genres-view' );
          }
          // console.log( this.isUserMember, this.isUserAdmin, this.isUserChannelCreator, this.isUserMemberInvite, this.isUserAdminInvite, this.isUserAnon );

          this.invitedAsAdmin = [];
          this.invitedAsMember = [];

          this.wavesurfer = WaveSurfer.create( {
            container: "#waveform"
            , waveColor: "#F46036"
            , progressColor: "#000"
            , scrollParent: true
            , hideScrollbar: true
            , height: 81
            , barWidth: 2
          } );

          this.wavesurfer.load( "http://ia902606.us.archive.org/35/items/shortpoetry_047_librivox/song_cjrg_teasdale_64kb.mp3" );

          this.wavesurfer.on( "ready", () => {
            // wavesurfer.play();
          } );
      }
  };

  this.$onChanges = ( changes ) => {
      console.log( 'changes are', changes );
      this.mainCtrl.updateCurrentUser();
  };

  this.$onDestroy = () => {
      if ( this.channel ) {
          this.leaveChannel();
          socketFactory.removeAllListeners();
      }
  };

  this.enterChannel = () => {
      channelService.enterChannel( this.channel._id, this.user.userName );
  };

  this.leaveChannel = () => {
      channelService.leaveChannel( this.channel._id, this.user.userName );
  };

  this.deleteChannel = () => {
      channelService.deleteChannel( this.channel._id );
      angular.element( document.querySelector( '#sidenav-overlay' ) ).css( 'opacity', '0' );
  };

  this.addUserToChannel = ( channelId, userId, userType ) => {
      channelService.addUserToChannel( channelId, userId, userType );
  };

  this.removeUserFromChannel = ( channelId, userId, userType ) => {
      channelService.removeUserFromChannel( channelId, userId, userType );
  };

  this.inviteUserAsAdmin = ( user ) => {
      this.invitedAsAdmin.push( user );
  };

  this.inviteUserAsMember = ( user ) => {
      this.invitedAsMember.push( user );
  };

  this.removeFromInvites = ( user, type ) => {
      let invitedUsers;
      if ( type === "admin" ) {
          invitedUsers = this.invitedAsAdmin;
      }
      else if ( type === "member" ) {
          invitedUsers = this.invitedAsMember;
      }
      const userIndex = invitedUsers.indexOf( user );
      invitedUsers.splice( userIndex, 1 );
  };

  this.confirmInvites = () => {
      let invitedUsers;
      if ( this.invitedAsAdmin.length ) {
          invitedUsers = this.invitedAsAdmin;
          invitedUsers.forEach( user => this.addUserToChannel( this.channel._id, user.originalObject._id, 'invitedAsAdmin' ) );
      }
      else if ( this.invitedAsMember.length ) {
          invitedUsers = this.invitedAsMember;
          invitedUsers.forEach( user => this.addUserToChannel( this.channel._id, user.originalObject._id, 'invitedAsMember' ) );
      }
  }

  this.cancelInvites = () => {
      this.invitedAsAdmin = [];
      this.invitedAsMember = [];
  };

  /**************** message functionality **********************/

  this.sendAndSaveMessage = ( keyEvent, message ) => {
    if( keyEvent.which === 13 ){
      message.author = this.user._id
      message.type = "message";
      messageService.sendAndSaveMessage( message, this.channel._id );
    }
  };

  this.updateMessage = ( message, channelId ) => {
    console.log("Im Running")
    messageService.updateMessage( message, channelId );
  }

  socketFactory.on( "get channel", data => {
    this.channel = data;
    this.mainCtrl.updateCurrentUser();
    console.log( "updated channel is: ", this.channel );
  } );

  socketFactory.on( "get status of channel", data => {
    this.channelStatus = data;
    console.log( "channel status: ", this.channelStatus );
  } );

  socketFactory.on( "channel deleted", data => {
    console.log( "channel deleted", data );
    this.mainCtrl.updateCurrentUser();
    $state.go( "genres-view" );
  } );


  const image = document.createElement( 'img' );
    image.src = require( './styles/imgs/testpic.jpg' );
    $scope.user = image.src;

	const playList = document.createElement( "img" );
	playList.src = require( "./styles/imgs/webpack.jpg" );
	$scope.playlist = playList.src;

}

const channelComponent = {
	template: channelViewHtml
  , controller: channelCtrl
  , require:
			{
				mainCtrl: "^mainComponent"
			}
  , bindings:
      {
          channel: '<'
          , user: '<'
      }
};

export default channelComponent;
