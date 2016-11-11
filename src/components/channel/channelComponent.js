import channelViewHtml from "./channel-view-tmpl.html";
import "./styles/channel.scss";

function channelCtrl( $scope, messageService, socketFactory, channelService ) {
  this.$onInit = () => {
      this.enterChannel();
      this.isUserMember = false;
      this.isUserAdmin = false;
      this.isUserMemberInvite = false;
      this.isUserAdminInvite = false;

      for ( let i = 0; i < this.channel.members.length; i++ ) {
          if ( this.channel.members[ i ]._id === this.user._id ) {
              this.isUserMember = true;
          }
      }

      for ( let i = 0; i < this.channel.admins.length; i++ ) {
          if ( this.channel.admins[ i ]._id === this.user._id ) {
              this.isUserAdmin = true;
              if ( this.channel.createdBy === this.user._id ) {
                  this.isUserChannelCreator = true;
              }
          }
      }

      for ( let i = 0; i < this.channel.invitedAsMember.length; i++ ) {
          if ( this.channel.invitedAsMember[ i ]._id === this.user._id ) {
              this.isUserMemberInvite = true;
          }
      }

      for ( let i = 0; i < this.channel.invitedAsAdmin.length; i++ ) {
          if ( this.channel.invitedAsAdmin[ i ]._id === this.user._id ) {
              this.isUserAdminInvite = true;
          }
      }

      console.log( this.isUserMember,
      this.isUserAdmin,
      this.isUserMemberInvite,
      this.isUserAdminInvite );
  };



  this.$onChanges = ( changes ) => {
      console.log( 'changes are', changes );
      this.mainCtrl.updateCurrentUser();

  };

  this.$onDestroy = () => {
      this.leaveChannel();
  };

  /******** functions keeping track of any and all users entering and leaving a channel ********/

  this.enterChannel = () => {
      channelService.enterChannel( this.channel._id, this.user.userName );
  };

  this.leaveChannel = () => {
      channelService.leaveChannel( this.channel._id, this.user.userName );
  };

  this.addUserToChannel = ( channelId, userId, userType ) => {
      channelService.addUserToChannel( channelId, userId, userType );
  };

  this.removeUserFromChannel = ( channelId, userId, userType ) => {
      channelService.removeUserFromChannel( channelId, userId, userType );
  };

  /*************** admin functions to invite other admins/members **************/

  this.addAdminToChannel = ( userId ) => {
      channelService.addUserToChannel( this.channel._id, userId, 'admin' );
  };

  this.addMemberToChannel = ( userId ) => {
      channelService.addUserToChannel( this.channel._id, userId, 'member' );
  };

  this.inviteUserToChannelAsMember = ( userId ) => {
      channelService.addUserToChannel( this.channel._id, userId, 'invitedAsMember' );
  };

  this.uninviteUserFromChannelAsMember = ( userId ) => {
      channelService.removeUserFromChannel( this.channel._id, userId, 'invitedAsMember' );
  };

  this.inviteUserToChannelAsAdmin = ( userId ) => {
      channelService.addUserToChannel( this.channel._id, userId, 'invitedAsAdmin' );
  };

  this.uninviteUserFromChannelAsAdmin = ( userId ) => {
      channelService.removeUserFromChannel( this.channel._id, userId, 'invitedAsAdmin' );
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
    messageService.updateMessage( message, channelId );
  }

  socketFactory.on( "get channel", data => {
    this.channel = data;
    console.log( "updated channel is: ", this.channel );
  } );

  socketFactory.on( "get status of channel", data => {
    this.channelStatus = data;
    console.log( "channel status: ", this.channelStatus );
  } );


  const image = document.createElement( 'img' );
    image.src = require( './styles/imgs/testpic.jpg' );
    $scope.user = image.src;

	const playList = document.createElement( "img" );
	playList.src = require( "./styles/imgs/webpack.jpg" );
	$scope.playlist = playList.src;


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

	this.$onDestroy = () => {
		this.wavesurfer.stop();
	};

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
