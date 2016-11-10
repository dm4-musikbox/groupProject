import genresViewHtml from "./genres-view-tmpl.html";
import "./styles/sass/genresView.scss";

function genresCtrl() {
		this.$onInit = () => {

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
