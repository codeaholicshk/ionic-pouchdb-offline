angular.module('starter.controllers', ['pouchdb', 'ngCordova'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, pouchCollection) {
})

.controller('ConnectionStatusCtrl', function($scope, $cordovaNetwork) {
  // connection status detection
  $scope.connected = false;

  $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
    $scope.connected = true;
  });

  $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
    $scope.connected = false;
  });
})

.controller('PlaylistsCtrl', function($scope, $firebaseArray) {
  // 1. add playlist, both updated
  // 2. offline and add, then online again, both updated
  $scope.playlists = pouchCollection('playlists');
  $scope.sync = null;

  $rootScope.$on('$cordovaNetwork:online', function(event, networkState) {
    $scope.sync =  $scope.playlists.$db.replicate.sync('http://127.0.0.1:5984/playlists', {live: true})
      .on('error', function (err) {
        console.log("Syncing stopped");
      });
  });

  $rootScope.$on('$cordovaNetwork:offline', function(event, networkState) {
    if ($scope.sync) {
      $scope.sync.cancel();
    }
  });

  $scope.addPlaylist = function() {
    $scope.playlists.$add({
      title: "New Playlist"
    });
  };
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
