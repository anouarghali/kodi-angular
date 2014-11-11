/* global services:true */

'use strict';

services.service('KodiWS', ['$q', function($q) {
  var ws = new WebSocket('ws://localhost:9090/jsonrpc');

  ws.onopen = function() {
    console.log('Connected to Kodi Web Socket');
  };

  function waitForConnection(callback) {
    setTimeout(function() {
      if (ws.readyState !== WebSocket.OPEN)
        {
          console.log('Wait for connection...');
          waitForConnection(callback);
        }
      else
        {
          callback();
        }
    }, 5);
  }

  function sendMessage(method) {
    var deferred = $q.defer();
    waitForConnection(function() {
      ws.send(JSON.stringify({jsonrpc: '2.0', id: 1, method: method}));
      ws.onmessage = function(message) {
        var response = JSON.parse(message.data);
        deferred.resolve(response.result);
      };
    });
    return deferred.promise;
  }

  var service = {
    send: sendMessage,
  };
  return service;
}]);
