import channelViewHtml from "./channel-view-tmpl.html";
import "./styles/channel.scss";

function channelCtrl( $scope ) {
	this.$onInit = () => {

	};

	this.$onChanges = ( changes ) => {
		console.log( "changes are", changes );
	};

	const image = document.createElement( "img" );
	image.src = require( "./styles/imgs/testpic.jpg" );
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
				channel: "<"
			}
};

export default channelComponent;
