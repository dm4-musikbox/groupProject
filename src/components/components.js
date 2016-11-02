import angular from 'angular';
import recorderComponent from './recorder/recorderComponent';
import socketTestComponent from './socket-test/socketTestComponent';

angular.module( 'components', [] )
        .component( 'recorderComponent', recorderComponent )
        .component( 'socketTestComponent', socketTestComponent );
