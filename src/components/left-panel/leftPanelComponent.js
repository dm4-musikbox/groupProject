import leftPanelHtml from "./left-panel-tmpl.html";
import "./styles/sass/left-panel.scss";

function leftPanelCtrl( $state, authService, channelService ) {
	this.$onChanges = ( changes ) => {
		console.log( changes );
	};

	const image = document.createElement( "img" );
	image.src = require( "./styles/imgs/circle-shape-outline.svg" );
	this.circle = image.src;
	this.authService = authService;

	this.createChannel = ( channel ) => {
		channel.createdBy = this.user._id;
		channel.admins = [ this.user._id ];
		channelService
						.createChannel( channel )
						.then( channel =>								{
							$state.go( "channel-view", { _id: channel.data._id } );
						}
						);
	};
}

const leftPanelComponent = {
	template: leftPanelHtml
		, controller: leftPanelCtrl
    , bindings: {
	user: "<"
}
};

export default leftPanelComponent;
