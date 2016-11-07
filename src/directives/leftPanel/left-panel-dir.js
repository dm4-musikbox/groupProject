import leftPanelHtml from "./left-panel.html";
import "./styles/sass/left-panel.scss";

export default function leftPanelDir() {
	return {
		template: leftPanelHtml
    , restrict: "EA"
    , scope: {
				user: "<"
		}
    , controller ( $scope ) {
				const image = document.createElement( "img" );
				image.src = require( "./styles/imgs/circle-shape-outline.svg" );
				$scope.circle = image.src;
		}
	};
}
