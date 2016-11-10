import browseGridHtml from "./grid.html";
import "./styles/sass/grid.scss";

function browseGridCtrl( genreService ) {
		this.$onInit = () => {
				genreService.getGenreNames()
						.then( genreNames => {
								this.genreNames = genreNames.data;
						} );
		};
}

const browseGridComponent = {
	template: browseGridHtml
  , controller: browseGridCtrl
};

export default browseGridComponent;
