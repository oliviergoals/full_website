var sample = angular.module("sample", ["sdk"]);

sample.controller("sampleController", [
  "$rootScope",
  "rainbowSDK",
  function($rootScope, sdk, $mdDialog ) {
    "use strict";

    /*********************************************************/
    /**                INITIALIZATION STUFF                 **/
    /*********************************************************/
    $rootScope.chat_val = "Open Chat" 
    $rootScope.open_chat = false; 
    console.log("[DEMO] :: Rainbow IM Application");

    var appId = "792b0db04b6b11ea819a43cb4a9dae9b";
    var appSecret = "4zdXVWUxBhxRnlgSDyjCfMv6um8ikpG2IRMbTryX27gly1dmedgGDaXl3B2o44ya";

    var onReady = function onReady() {
      console.log("[DEMO] :: Rainbow SDK is ready!");
    };

    var onLoaded = function onLoaded() {
      console.log("[DEMO] :: Rainbow SDK has been loaded!");

      sdk
        .initialize(appId, appSecret)
        .then(function() {
          console.log("[DEMO] :: Rainbow SDK is initialized!");
        })
        .catch(function() {
          console.log("[DEMO] :: Something went wrong with the SDK...");
        });
    };

    $rootScope.butt_val_changer = function(){
      $rootScope.open_chat = !$rootScope.open_chat;
      if ($rootScope.open_chat == true){
        $rootScope.chat_val = "Close Chat";
      }
      else{
        $rootScope.chat_val = "Open Chat"
      }
    }
    // $scope.showAdvanced = function() {
    //   $mdDialog.show({
    //     controller: DialogController,
    //     templateUrl: 'rainbow.html',
    //     parent: angular.element(document.body),
    //     targetEvent: ev,
    //     clickOutsideToClose:true,
    //     fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
    //   })
    //   .then(function(answer) {
    //     $scope.status = 'You said the information was "' + answer + '".';
    //     console.log("pass");
    //   }, function() {
    //     $scope.status = 'You cancelled the dialog.';
    //     console.log("close");
    //   });
    // };

    document.addEventListener(sdk.RAINBOW_ONREADY, onReady);

    document.addEventListener(sdk.RAINBOW_ONLOADED, onLoaded);

    sdk.load();

    return true;
  }
]);
