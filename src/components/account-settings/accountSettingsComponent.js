import accountSettingsHtml from "./account-settings-view-tmpl.html";
import "./account-settings-view.scss";

const accountSettingsComponent = {
	template: accountSettingsHtml
	  , controller( $state, genreService ) {
		this.$onInit = () => {

		};

		this.$onChanges = () => {
			this.updatedUser = Object.assign( {}, this.user );
			if ( this.user.userLinks ) {
				this.updatedUser.userLinks = this.updatedUser.userLinks.join( "\n" );
			}
			this.getGenreNames();
		};

		this.getGenreNames = () => {
				genreService.getGenreNames()
								.then( genreNames => {
									this.genreNames = genreNames.data;
								} );

		};

		this.updateCurrentUser = ( updatedUser ) => {
			this.onUpdate( { updatedUser } );
			$state.go( "genres-view" );
		};

		this.unsubscribeFromChannel = ( channel ) => {
						// const channelIndex = this.dummyUserChannels.indexOf( channel );
						// this.dummyUserChannels.splice( channelIndex, 1 );
		};
	}
		, bindings:
		{
			user: "<"
						, onUpdate: "&"
		}
};


export default accountSettingsComponent;
