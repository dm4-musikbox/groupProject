import genreViewHtml from "./genre-view-tmpl.html";
import "./styles/sass/genre.scss";

function genreCtrl( $location, $stateParams ) {
		this.$onInit = () => {
				console.log( this.genre );
		};

}

const genreComponent = {
	template: genreViewHtml
  , controller: genreCtrl
	, bindings:
			{
					genre: '<'
			}
};

export default genreComponent;
