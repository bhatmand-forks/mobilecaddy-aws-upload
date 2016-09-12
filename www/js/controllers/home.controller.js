/**
 * Home Controller
 *
 * @description description
 */
(function() {
  'use strict';

  angular
    .module('starter.controllers')
    .controller('HomeCtrl', HomeCtrl);

  HomeCtrl.$inject = ['$scope'];

  function HomeCtrl($scope) {
  	var imageUploader = new ImageUploader();
  	$scope.file = {};

    $scope.captureAudio = function() {
      // capture callback
      var captureSuccess = function(mediaFiles) {
          var i, path, len;
          for (i = 0, len = mediaFiles.length; i < len; i += 1) {
              path = mediaFiles[i].fullPath;
              // do something interesting with the file
          }
      };

      // capture error callback
      var captureError = function(error) {
          navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
      };

      // start audio capture
      navigator.device.capture.captureAudio(captureSuccess, captureError, {limit:2});
    };

    $scope.captureImage = function() {
      // capture callback
      var captureSuccess = function(mediaFiles) {
          var i, path, len;
          for (i = 0, len = mediaFiles.length; i < len; i += 1) {
              path = mediaFiles[i].fullPath;
              // do something interesting with the file
          }
      };

      // capture error callback
      var captureError = function(error) {
          navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
      };

      // start image capture
      navigator.device.capture.captureImage(captureSuccess, captureError, {limit:2});
    };

    $scope.captureVideo = function() {
      // capture callback
      var captureSuccess = function(mediaFiles) {
          var i, path, len;
          for (i = 0, len = mediaFiles.length; i < len; i += 1) {
              path = mediaFiles[i].fullPath;
              // do something interesting with the file
          }
      };

      // capture error callback
      var captureError = function(error) {
          navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
      };

      // start video capture
      navigator.device.capture.captureVideo(captureSuccess, captureError, {limit:2});
    };




	  $scope.upload = function() {
      console.log('File upload', $scope.file);
	    imageUploader.push($scope.file).then(function(data){
	      console.log('File uploaded Successfully', $scope.file, data);
	      // $scope.uploadUri = data.url;
	      // $scope.$digest();
	    }).catch(function(e){
	    	console.error(e);
	    });
	  };

  }

})();