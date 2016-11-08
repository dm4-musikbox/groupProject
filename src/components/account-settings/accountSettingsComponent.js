import accountSettingsHtml from "./account-settings-view-tmpl.html";
import './account-settings-view.scss';

const accountSettingsComponent = {
		template: accountSettingsHtml
	  , controller ( $state, $timeout ) {
				this.$onInit = () => {
						this.dummyUserChannels = [ 'Bill and Ted\'s excellent collab', 'song for Rihanna', 'jazzJam' ];
				}
				this.$onChanges = () => {
						this.updatedUser = Object.assign( {}, this.user );
						if ( this.user.userLinks ) {
								this.updatedUser.userLinks = this.updatedUser.userLinks.join( '\n' );
						}
				};

				this.updateCurrentUser = ( updatedUser ) => {
						this.onUpdate( { updatedUser } );
						$state.go( 'genres-view' );
				};

				this.unsubscribeFromChannel = ( channel ) => {
						const channelIndex = this.dummyUserChannels.indexOf( channel );
						this.dummyUserChannels.splice( channelIndex, 1 );
				};
		}
		, bindings:
				{
						user: '<'
						, onUpdate: '&'
				}
};


export default accountSettingsComponent;
