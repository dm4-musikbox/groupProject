import leftPanelHtml from "./left-panel-tmpl.html";
import "./styles/sass/left-panel.scss";

function leftPanelCtrl( $state, authService, channelService ) {
	this.$onInit = () => {
			this.channel = {
					invitedAsAdmin: []
					, invitedAsMember: []
			};

			this.invitedAsAdmin = [];
			this.invitedAsMember = [];

			const image = document.createElement( "img" );
			image.src = require( "./styles/imgs/circle-shape-outline.svg" );
			this.circle = image.src;
			this.authService = authService;
	};

	this.$onChanges = ( changes ) => {
			// console.log( changes );
	};

	this.inviteAsAdmin = ( user ) => {
			this.invitedAsAdmin.push( user );
			this.channel.invitedAsAdmin.push( user.originalObject._id );
			console.log( this.invitedAsAdmin );
	};

	this.inviteAsMember = ( user ) => {
			this.invitedAsMember.push( user );
			this.channel.invitedAsMember.push( user.originalObject._id );
			console.log( this.invitedAsMember );
	};

	this.removeFromInvites = ( user, type ) => {
			let invitedUsers;
			let invitedUserIds;
			if ( type === "admin" ) {
					invitedUsers = this.invitedAsAdmin;
					invitedUserIds = this.channel.invitedAsAdmin
			}
			else if ( type === "member" ) {
					invitedUsers = this.invitedAsMember;
					invitedUserIds = this.channel.invitedAsMember
			}
			const userIndex = invitedUsers.indexOf( user );
			const userIdIndex = invitedUserIds.indexOf( user.originalObject._id );
			invitedUsers.splice( userIndex, 1 );
			invitedUserIds.splice( userIdIndex, 1 );
	};

	this.clearInputs = () => {
			this.channel = {
					invitedAsAdmin: []
					, invitedAsMember: []
			};
			this.invitedAsAdmin = [];
			this.invitedAsMember = [];
	};

	this.createChannel = ( channel ) => {
		channel.createdBy = this.user._id;
		channel.admins = [ this.user._id ];
		channelService
						.createChannel( channel )
						.then( channel =>								{
							this.clearInputs();
							$state.go( "channel-view", { _id: channel.data._id } );
						}
						);
	};
}

const leftPanelComponent = {
	template: leftPanelHtml
		, controller: leftPanelCtrl
    , bindings: {
				genreNames: "<"
				, user: "<"
				, users: "<"
			}
};

export default leftPanelComponent;
