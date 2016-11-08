import accountSettingsHtml from "./account-settings-view-tmpl.html";

const accountSettingsComponent = {
		template: accountSettingsHtml
	  , controller ( $state, $timeout ) {
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
		}
		, bindings:
				{
						user: '<'
						, onUpdate: '&'
				}
};


export default accountSettingsComponent;
