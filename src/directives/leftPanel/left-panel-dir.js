import leftPanelHtml from "./left-panel.html";
import "./styles/sass/left-panel.scss";

function leftPanelDir() {
		return {
				template: leftPanelHtml
		    , scope: {
						user: "<"
				}
		    , controller ( $scope, authService ) {
						const image = document.createElement( "img" );
						image.src = require( "./styles/imgs/circle-shape-outline.svg" );
						$scope.circle = image.src;
						$scope.authService = authService;
				}
		};
}

export default leftPanelDir;
