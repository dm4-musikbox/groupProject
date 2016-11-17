import leftPanelHtml from "./left-panel-tmpl.html";
import "./styles/sass/left-panel.scss";

function leftPanelCtrl( $state, authService, channelService, socketFactory, userService ) {
	this.$onInit = () => {
			this.channel = {
					invitedAsAdmin: []
					, invitedAsMember: []
			};

			this.invitedAsAdmin = [];
			this.invitedAsMember = [];

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
		channelService.createChannel( channel );
	};

	this.setIsUpdatedProp = ( channel, user, userType, setTo ) => {
		userService.setIsUpdatedProp( channel, user, userType, setTo );
	};

	this.itemClicked = ( $index ) => {
			this.selectedIndex = $index;
	};

	socketFactory.on( 'channel created', ( data ) => {
			this.clearInputs();
			$state.go( "channel-view", { _id: data._id } );
	} );

	socketFactory.on( 'get status of channel', ( data ) => {
			this.channelStatus = data;
			console.log( 'channel status is ', data );
	} );

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
