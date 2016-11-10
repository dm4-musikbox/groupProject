import angular from "angular";

import socketFactory from "./socketFactory.js";
import artistService from "./artistService.js";
import authService from "./authService.js";
import channelService from "./channelService.js";
import genreService from "./genreService.js";
import messageService from "./messageService.js";
import recorderService from "./recorderService.js";
import recordingService from "./recordingService.js";
import uploadService from "./uploadService.js";
import userService from "./userService.js";

angular.module( "services", [] )
      .factory( "socketFactory", socketFactory )
      .service( "artistService", artistService )
      .service( "authService", authService )
      .service( "channelService", channelService )
      .service( "genreService", genreService )
      .service( "messageService", messageService )
      .service( "recorderService", recorderService )
      .service( "recordingService", recordingService )
      .service( "uploadService", uploadService )
      .service( "userService", userService );
