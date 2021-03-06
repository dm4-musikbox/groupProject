import angular from "angular";
import angularFilter from "angular-filter";
import "angucomplete-alt"
import uiRouter from "angular-ui-router";
import "auth0-lock";
import "angular-lock";
import "angular-jwt";
import "wavesurfer.js";
import angularMaterialize from "angular-materialize";
import "angular-xeditable";
import "angularjs-scroll-glue";


import "./services/servicesModule";
import "./components/componentsModule";
import run from "./app.run.js";
import config from "./app.config.js";

angular
    .module( "musikboxApp", [ "auth0.lock", "xeditable","luegg.directives", "angular-jwt", "angucomplete-alt", "components", "services", angularFilter, angularMaterialize, uiRouter ] )
    .run( run )
    .config( config )
    .constant( "ref", {
	url: "http://localhost:5000"
} );
