import artistsViewHtml from "./artists-view-tmpl.html";
import './styles/sass/artists.scss';

function artistsCtrl( $state ) {
		// console.log( this.artistChannels );
}

const artistsComponent = {
	template: artistsViewHtml
  , controller: artistsCtrl
	, bindings:
			{
					artistChannels: '<'
			}
};

export default artistsComponent;
