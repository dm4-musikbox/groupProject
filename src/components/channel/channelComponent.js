import channelViewHtml from "./channel-view-tmpl.html";
import "./styles/channel.scss";


function channelCtrl( $scope, messageService, socketFactory, channelService ) {
  this.$onInit = () => {
    this.enterChannel();
    this.glued = true;
    this.playing = false;
  };

  this.$onChanges = ( changes ) => {
      console.log( 'changes are', changes );
      this.mainCtrl.updateCurrentUser()
      console.log( this.user );
  };

  this.togglePlay = () => {
    if( !this.playing ){
      this.playing = true;
    }
    else {
      this.playing = false;
    }
  }

  this.enterChannel = () => {
    channelService.enterChannel( this.channel._id, this.user.userName );
  };

  this.sendAndSaveMessage = ( keyEvent, message ) => {
    if( keyEvent.which === 13 ){
      this.channelId = this.channel._id
      console.log (this.user);
      message.author = this.user._id
      message.type = "message";
      messageService.sendAndSaveMessage( message, this.channelId );
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
    console.log( "get channel received! channel is ", this.channel );
  } );

  socketFactory.on( "get status of channel", data => {
    console.log( data );
    this.channelStatus = data;
  } );


  const image = document.createElement( 'img' );
    image.src = require( './styles/imgs/testpic.jpg' );
    $scope.user = image.src;

	const playList = document.createElement( "img" );
	playList.src = require( "./styles/imgs/webpack.jpg" );
	$scope.playlist = playList.src;




	const wavesurfer = WaveSurfer.create( {
		container: "#waveform"
  , waveColor: "#F46036"
  , progressColor: "#000"
  , scrollParent: true
  , hideScrollbar: true
  , height: 81
  , barWidth: 2
	} );

	wavesurfer.load( "http://ia902606.us.archive.org/35/items/shortpoetry_047_librivox/song_cjrg_teasdale_64kb.mp3" );

	wavesurfer.on( "ready", () => {
		  wavesurfer.play();
	} );

	this.$onDestroy = () => {
		wavesurfer.stop();
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
