import angular from 'angular';

import socketFactory from './socketFactory.js';
import authService from './authService.js';
import messageService from './messageService.js';
import recorderService from './recorderService.js';
import recordingService from './recordingService.js';

angular.module( 'services', [] )
      .factory( 'socketFactory', socketFactory )
      .service( "authService", authService )
      .service( "messageService", messageService )
      .service( "recorderService", recorderService )
      .service( "recordingService", recordingService );
