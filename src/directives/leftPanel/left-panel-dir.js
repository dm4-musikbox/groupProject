import leftPanelHtml from "./left-panel.html";
import './styles/sass/left-panel.scss';

export default function leftPanelDir () {
  return {
    template: leftPanelHtml
    , controller: function( $scope ){
        const img = document.createElement( 'img' );
          img.src = require( './styles/imgs/circle-shape-outline.svg' );
          $scope.circle = img.src;
    }
  }
}
