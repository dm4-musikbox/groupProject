import genreViewHtml from "./genre-view-tmpl.html";
import "./styles/sass/genre.scss";

function genreCtrl() {
		this.$onInit = () => {

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
