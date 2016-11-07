import angular from "angular";
import uiRouter from "angular-ui-router";
import "auth0-lock";
import "angular-lock";
import "angular-jwt";
// import "wavesurfer.js";
import $ from "jquery";

window.jQuery = $;
window.$ = $;

import "./services/servicesModule";
import "./components/componentsModule";
import run from "./app.run.js";
import config from "./app.config.js";

angular
    .module( "musikboxApp", [ "auth0.lock", "angular-jwt", "components", "services", uiRouter ] )
    .run( run )
    .config( config )
    .constant( 'ref', {
      url: 'http://localhost:5000'
    });
