import angular from "angular";
import uiRouter from "angular-ui-router";
import "auth0-lock";
import "angular-lock";
import "angular-jwt";

import leftPanelHtml from './directives/leftPanel/left-panel.html'
import leftPanelDir from './directives/leftPanel/left-panel-dir.js'

import landingPageViewHtml from './components/landing-page/landing-page-view-tmpl.html';
import landingPageComponent from './components/landing-page/landingPageComponent.js';

import mainViewHtml from './components/main/main-view-tmpl.html';
import mainComponent from './components/main/mainComponent.js';

import channelViewHtml from './components/channel/channel-view-tmpl.html';
import channelComponent from './components/channel/channelComponent.js';

import genreViewHtml from './components/genre/genre-view-tmpl.html';
import genreComponent from './components/genre/genreComponent.js';

import accountSettingsViewHtml from './components/account-settings/account-settings-view-tmpl.html';
import accountSettingsComponent from './components/account-settings/accountSettingsComponent.js';

import socketTestComponent from './components/socket-test/socket-test.component.js';

import browseViewHtml from './components/browse/browse-view-tmpl.html';
import browseComponent from './components/browse/browseComponent.js';

import genresViewHtml from './components/genres/genres-view-tmpl.html';
import genresComponent from './components/genres/genresComponent.js';

import artistsViewHtml from './components/artists/artists-view-tmpl.html';
import artistsComponent from './components/artists/artistsComponent.js';

import authService from "./services/authService";
import socketFactory from "./services/socketFactory";

angular.module( "musikboxApp", [ "auth0.lock", "angular-jwt", uiRouter ] )
    .run( function( $rootScope, $state, $timeout, authService, authManager, jwtHelper, lock ) {
      	lock.interceptHash();
      	$rootScope.authService = authService;
      	authService.registerAuthenticationListener();
      	authManager.checkAuthOnRefresh();
      	authManager.redirectWhenUnauthenticated();

      	$rootScope.$on( "$stateChangeStart", ( event, to, toParams ) => {
      		const token = localStorage.getItem( "id_token" );
      		if ( to.data && to.data.requiresLogin ) {
      			if ( jwtHelper.isTokenExpired( token ) ) {
      				$timeout( () => {
      					$state.go( "landing-page" );
      				} );
      			}
      		}
      	} );
      } )
    .service( "authService", authService )
    .component( 'socketTestComponent', socketTestComponent )
    .component( "landingPageComponent", landingPageComponent )
    .component( "mainComponent", mainComponent )
    .component( "channelComponent", channelComponent )
    .component( "genreComponent", genreComponent )
    .component( "browseComponent", browseComponent )
    .component( "genresComponent", genresComponent )
    .component( "artistsComponent", artistsComponent )
    .component( "accountSettingsComponent", accountSettingsComponent )
    .directive( "leftPanelDir", leftPanelDir )
    .config( function( $httpProvider, $stateProvider, $urlRouterProvider, jwtOptionsProvider, jwtInterceptorProvider, lockProvider ) {
      	lockProvider.init( {
      		clientID: "dxHLsmsTwuygusXFm9bs1e2bqbF91EK3"
      		 , domain: "musikbox.auth0.com"
      		 , options: {
          			autoclose: false
          			 , auth: {
          				redirect: false
          			}
          			 , languageDictionary: {
            				emailInputPlaceholder: "something@youremail.com"
              	  , title: "Musikbox"
          			}
                , theme: {
                    primaryColor: '#4d394b'
                }
      		}
      	} );

        jwtOptionsProvider.config({
          tokenGetter: function() {
            return localStorage.getItem('id_token');
          }
        } );

        $httpProvider.interceptors.push('jwtInterceptor');

      	$urlRouterProvider.otherwise( "/" );

      	$stateProvider
                  .state( "landing-page", {
                  	url: "/"
                    // , component: 'socketTestComponent'
                  	, component: 'landingPageComponent'
                  } )
                  .state( "main-view", {
                  	url: "/main"
                  	, component: 'mainComponent'
                  } )
                  .state( "channel-view", {
                    url: "/channel"
                    , parent: 'main-view'
                    , component: 'channelComponent'
                  } )
                  .state( "account-settings-view", {
                    url: "/account-settings"
                    , parent: 'main-view'
                    , component: "accountSettingsComponent"
                  } )
                  .state( "genre-view", {
                    url: "/genre"
                    , parent: 'main-view'
                    , component: 'genreComponent'
                  } )
                  .state( "browse-view", {
                    url: "/browse"
                    , parent: 'main-view'
                    , component: "browseComponent"
                  } )
                  .state( "genres-view", {
                    url: "/genres"
                    , parent: 'browse-view'
                    , component: "genresComponent"
                  } )
                  .state( "artists-view", {
                    url: "/artists"
                    , parent: 'browse-view'
                    , component: "artistsComponent"
                  } )
    } );
