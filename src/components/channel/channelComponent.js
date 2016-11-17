import channelViewHtml from "./channel-view-tmpl.html";
import "./styles/channel.scss";

function channelCtrl( $interval, $scope, $state, messageService, recorderService, socketFactory, channelService, recordingService ) {
  this.$onInit = () => {
      if ( this.channel ) {
        this.enterChannel();
        this.isUserMember = false;
        this.isUserAdmin = false;
        this.isUserChannelCreator = false;
        this.isUserMemberInvite = false;
        this.isUserAdminInvite = false;
        this.isUserAnon = true;
        this.glued = true;
        this.playing = false;
        this.hasSong = false;

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

        recorderService.setCurrentUserAndChannel( this.user._id, this.user.fullName, this.channel._id );
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

  // this.togglePlay = () => {
  //   if( !this.playing ){
  //     this.playing = true;
  //   }
  //   else {
  //     this.playing = false;
  //   }
  // }

  this.enterChannel = () => {
      if ( this.channel ) {
        channelService.enterChannel( this.channel, this.user );
      }
  };

  this.leaveChannel = () => {
      channelService.leaveChannel( this.channel._id, this.user.fullName );
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

  this.confirmAndSendInvites = () => {
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
      keyEvent.preventDefault();
      message.author = this.user._id
      message.type = "message";
      messageService.sendAndSaveMessage( message, this.channel._id );
      this.message.content = "";
    }
  };

  this.updateMessage = ( message, channelId ) => {
    messageService.updateMessage( message, channelId );
  }

  this.deleteMessage = ( messageId, channelId ) => {
    messageService.deleteMessage( messageId, channelId );
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
    this.mainCtrl.updateCurrentUser();
    $state.reload();
  } );

  socketFactory.on( "redirect channel creator upon channel deletion", data => {
    $state.go( "genres-view" );
  } );


  const image = document.createElement( 'img' );
    image.src = require( './styles/imgs/testpic.jpg' );
    $scope.user = image.src;

	const playList = document.createElement( "img" );
	playList.src = require( "./styles/imgs/webpack.jpg" );
	$scope.playlist = playList.src;

// Record / Play functions
  this.playSong = () => {
    this.wavesurfer.play();
    this.playing = true;
  }

  this.pauseSong= () => {
    this.playing = false;
    this.wavesurfer.pause();
  }

  this.startRecording = () => {
    if ( this.wavesurfer ){
      this.wavesurfer.destroy();
    }

    this.wavesurfer = WaveSurfer.create( {
      container: "#waveform"
      , waveColor: "#F46036"
      , progressColor: "#000"
      , scrollParent: true
      , hideScrollbar: true
      , height: 81
      , barWidth: 2
    } );
    recorderService.startRecording();
  }

  this.stopRecording = () => {
    this.closeNav();
    recorderService.stopRecording();
  };

  this.cancelRecording = () => {
    this.wavesurfer.destroy();
  };

  this.sendSong = ( song ) => {
    if ( this.wavesurfer ){
      this.wavesurfer.destroy();
    }
    this.wavesurfer = WaveSurfer.create( {
      container: "#waveform"
      , waveColor: "#F46036"
      , progressColor: "#000"
      , scrollParent: true
      , hideScrollbar: true
      , height: 81
      , barWidth: 2
    } );
    this.wavesurfer.load( song );
  }

  this.deleteRecording = ( recording, channelId, userId ) => {
    if ( recording.createdBy._id !== userId ){
        return alert("You can only delete your own recordings.")
    }
    recordingService.deleteRecording( recording, channelId );
    this.wavesurfer.destroy();
    this.playing = false;
  }

	// this.wavesurfer.on( "ready", () => {
	// 	  wavesurfer.play();
	// } );

  socketFactory.on( "get recording preview", data => {
    console.log( 'preview data is ', data );
		this.recordingData = data;

    this.wavesurfer.load( this.recordingData.url );

    this.uploadAndSaveRecording = () => {
      recorderService.uploadRecordingToS3( this.recordingData, this.user._id, this.channel._id );
      this.wavesurfer.destroy();
      console.log("Recording Data" + this.recordingData)
    };
	} );

    // this.deletePreview = () => {
    //   // this.wavesurfer.destroy();
    //   $state.reload();
    // }

  socketFactory.on( "get S3 data", data => {
    console.log(data);
    this.data = {
            userId: this.user._id
            , channelId: this.channel._id
            , recording: {
  createdBy: this.user._id
                , description: ""
                , s3ETag: data.ETag
                , s3Location: data.Location
                , s3Bucket: data.Bucket
                , s3Key: data.Key
            }
    };
    socketFactory.emit( "save recording", this.data );
  } );



  // -----


  this.openNav = () => {
  angular.element( document.querySelector( '.mic-img-container' )  ).removeClass( 'animate-mic-reverse' );
  document.getElementById("myBotMic").style.height = "100%";
  angular.element( document.querySelector( '.mic-img-container' )  ).addClass( 'animate-mic' );

  }

  this.closeNav = () => {
  angular.element( document.querySelector( '.mic-img-container' )  ).removeClass( 'animate-mic' );
  angular.element( document.querySelector( '.mic-img-container' )  ).addClass( 'animate-mic-reverse' );
  document.getElementById("myBotMic").style.height = "0";
  }

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
