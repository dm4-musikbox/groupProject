import artistsViewHtml from "./artists-view-tmpl.html";

function artistsCtrl( $state ) {

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
