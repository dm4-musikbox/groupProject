import angular from 'angular';

function socketFactory() {
    const socket = io.connect();
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        },
      removeAllListeners: function (eventName, callback) {
          socket.removeAllListeners(eventName, function() {
              var args = arguments;
              $rootScope.$apply(function () {
                callback.apply(socket, args);
              });
          });
      }
    };
}

export default angular.module( 'musikboxApp' )
                      .factory( 'socketFactory', socketFactory );
