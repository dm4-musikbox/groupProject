import angular from 'angular';

import socketFactory from './socketFactory.js';
import authService from './authService.js';
import channelService from './channelService.js';
import messageService from './messageService.js';
import recorderService from './recorderService.js';
import recordingService from './recordingService.js';
import uploadService from './uploadService.js';
import userService from './userService.js';

angular.module( 'services', [] )
      .factory( 'socketFactory', socketFactory )
      .service( "authService", authService )
      .service( "channelService", channelService )
      .service( "messageService", messageService )
      .service( "recorderService", recorderService )
      .service( "recordingService", recordingService )
      .service( "uploadService", uploadService )
      .service( "userService", userService );
