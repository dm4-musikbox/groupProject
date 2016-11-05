import channelViewHtml from "./channel-view-tmpl.html";
import "./styles/channel.scss";

function channelCtrl() {

	const wavesurfer = WaveSurfer.create( {
		container: "#waveform"
  , waveColor: "#BDBDBD"
  , progressColor: "#33312E"
  , scrollParent: true
  , hideScrollbar: true
	} );

	wavesurfer.load( "http://ia902606.us.archive.org/35/items/shortpoetry_047_librivox/song_cjrg_teasdale_64kb.mp3" );

	wavesurfer.on( "ready", () => {
		wavesurfer.play();
	} );


	const channel = this;
	channel.test = "This is a test for channel Components!!!";

}

const channelComponent = {
	template: channelViewHtml
  , controller: channelCtrl
};

export default channelComponent;
