import genresViewHtml from "./genres-view-tmpl.html";
import "./styles/sass/genresView.scss";

function genresCtrl() {
		this.$onInit = () => {
				console.log( this.genreNames );
		};
}

const genresComponent = {
	template: genresViewHtml
  , controller: genresCtrl
	, bindings:
			{
					genreNames: '<'
			}
};

export default genresComponent;
