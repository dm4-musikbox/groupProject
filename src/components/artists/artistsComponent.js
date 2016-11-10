import artistsViewHtml from "./artists-view-tmpl.html";

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
