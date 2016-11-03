import angular from 'angular';

import socketFactory from './socketFactory.js';
import authService from './authService.js';
import recordingService from './recordingService.js';

angular.module( 'services', [] )
      .factory( 'socketFactory', socketFactory )
      .service( "authService", authService )
      .service( "recordingService", recordingService );
