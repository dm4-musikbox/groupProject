import angular from "angular";
import recorderComponent from "./recorder/recorderComponent";
import socketTestComponent from "./socket-test/socketTestComponent";
import landingPageComponent from "./landing-page/landingPageComponent.js";
import mainComponent from "./main/mainComponent.js";
import channelComponent from "./channel/channelComponent.js";
import genreComponent from "./genre/genreComponent.js";
import accountSettingsComponent from "./account-settings/accountSettingsComponent.js";
import browseComponent from "./browse/browseComponent.js";
import navBarComponent from "./browse/navbar/navBarComponent.js";
import browseGridComponent from "./browse/grid/gridComponent.js";
import genresComponent from "./genres/genresComponent.js";
import artistsComponent from "./artists/artistsComponent.js";
import popularComponent from "./popular/popularComponent.js";
import createChannelModalComponent from "./create-channel-modal/createChannelModalComponent.js";
import leftPanelComponent from "./left-panel/leftPanelComponent.js";
import fileReadDir from "./../directives/file-read/fileReadDirective.js";
// import playListComponent from "./playlist/playListComponent.js"

angular.module( "components", [] )
        .component( "recorderComponent", recorderComponent )
        .component( "socketTestComponent", socketTestComponent )
        .component( "landingPageComponent", landingPageComponent )
        .component( "mainComponent", mainComponent )
        .component( "leftPanelComponent", leftPanelComponent )
        .component( "channelComponent", channelComponent )
        .component( "genreComponent", genreComponent )
        .component( "browseComponent", browseComponent )
        .component( "navBarComponent", navBarComponent )
        .component( "browseGridComponent", browseGridComponent )
        .component( "genresComponent", genresComponent )
        .component( "artistsComponent", artistsComponent )
        .component( "popularComponent", popularComponent )
        // .component( "playListComponent", playlistComponent )
        .component( "accountSettingsComponent", accountSettingsComponent )
        .directive( "fileReadDir", fileReadDir );
