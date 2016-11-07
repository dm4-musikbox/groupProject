import accountSettingsHtml from "./account-settings-view-tmpl.html";

const accountSettingsComponent = {
		template: accountSettingsHtml
	  , controller () {
				this.$onChanges = () => {
						this.updatedUser = Object.assign( {}, this.user, this.updatedUser );
						if ( this.user.userLinks ) {
								this.updatedUser.userLinks = this.updatedUser.userLinks.join( '\n' );
						}
						console.log( this.updatedUser );
				};

				this.updateCurrentUser = ( updatedUser ) => {
						console.log( updatedUser );
						this.onUpdate( { updatedUser } );
				};
		}
		, bindings:
				{
						user: '<'
						, onUpdate: '&'
				}
};


export default accountSettingsComponent;
