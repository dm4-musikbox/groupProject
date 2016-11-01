import angular from "angular";
import uiRouter from "angular-ui-router";
import "auth0-lock";
import "angular-lock";
import "angular-jwt";

import landingPageViewHtml from './components/landing-page/landing-page-view-tmpl.html';
import landingPageCtrl from './components/landing-page/landingPageCtrl.js';

import mainViewHtml from './components/main/main-view-tmpl.html';
import mainCtrl from './components/main/mainCtrl.js';

import channelViewHtml from './components/channel/channel-view-tmpl.html';
import channelCtrl from './components/channel/channelCtrl.js';

import genreViewHtml from './components/genre/genre-view-tmpl.html';
import genreCtrl from './components/genre/genreCtrl.js';

import accountSettingsViewHtml from './components/account-settings/account-settings-view-tmpl.html';
import accountSettingsCtrl from './components/account-settings/accountSettingsCtrl.js';

import socketTestComponent from './components/socket-test/socket-test.component.js';

import browseViewHtml from './components/browse/browse-view-tmpl.html';
import browseCtrl from './components/browse/browseCtrl.js';

import genresViewHtml from './components/genres/genres-view-tmpl.html';
import genresCtrl from './components/genres/genresCtrl.js';

import artistsViewHtml from './components/artists/artists-view-tmpl.html';
import artistsCtrl from './components/artists/artistsCtrl.js';

import authService from "./services/authService";

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
    .controller( "landingPageCtrl", landingPageCtrl )
    .controller( "mainCtrl", mainCtrl )
    .controller( "channelCtrl", channelCtrl )
    .controller( "genreCtrl", genreCtrl )
    .controller( "accountSettingsCtrl", accountSettingsCtrl )
    .controller( "browseCtrl", browseCtrl )
    .controller( "genresCtrl", genresCtrl )
    .controller( "artistsCtrl", artistsCtrl )
    .component( 'socketTestComponent', socketTestComponent )
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
                  // .state( "landing-page", {
                  // 	url: "/"
                  // 	, template: landingPageViewHtml
                  //   , controller: landingPageCtrl
                  //   , controllerAs: 'landingPage'
                  // } )
                  .state( "landing-page", {
                  	url: "/"
                    , component: 'socketTestComponent'
                  } )
                  .state( "main-view", {
                  	url: "/main"
                  	, template: mainViewHtml
                  	, controller: mainCtrl
                    , controllerAs: 'main'
                    , params: {
                        profile: null
                    }
                  } )
                  .state( "channel-view", {
                    url: "/channel"
                    , parent: 'main-view'
                    , template: channelViewHtml
                    , controller: channelCtrl
                    , controllerAs: 'channel'
                  } )
                  .state( "account-settings-view", {
                    url: "/account-settings"
                    , parent: 'main-view'
                    , template: accountSettingsViewHtml
                    , controller: accountSettingsCtrl
                    , controllerAs: 'accountSettings'
                  } )
                  .state( "genre-view", {
                    url: "/genre"
                    , parent: 'main-view'
                    , template: genreViewHtml
                    , controller: genreCtrl
                    , controllerAs: 'genre'
                  } )
                  .state( "browse-view", {
                    url: "/browse"
                    , parent: 'main-view'
                    , template: browseViewHtml
                    , controller: browseCtrl
                    , controllerAs: 'browse'
                  } )
                  .state( "genres-view", {
                    url: "/genres"
                    , parent: 'browse-view'
                    , template: genresViewHtml
                    , controller: genresCtrl
                    , controllerAs: 'genres'
                  } )
                  .state( "artists-view", {
                    url: "/artists"
                    , parent: 'browse-view'
                    , template: artistsViewHtml
                    , controller: artistsCtrl
                    , controllerAs: 'artists'
                  } )
    } )
