var sample = angular.module("sample", ["sdk"]);

sample.controller("sampleController", [
  "$rootScope",
  "rainbowSDK",
  "$http",
  function($rootScope, sdk, $http) {
    "use strict";    
    /*********************************************************/
    /**                INITIALIZATION STUFF                 **/
    /*********************************************************/
    $rootScope.chat_val = "Open Chat" 
    $rootScope.open_chat = false;
    $rootScope.open_form = false;  
    console.log("rootscope vals changed")
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
    // TODO: Shake
    $rootScope.butt_val_changer = function(){  
      console.log("button pressed");    
      // $http({
      //   method: 'POST',
      //   url: 'http://localhost:3000/endChatInstance',
      //   //url: 'http://10.12.205.128:3000/getRequiredCSAbeta',
      //   dataType: 'json',
      //   data:
      //   {
      //     department: "hi",
      //     jidOfAgent: "asdfasdad"
      //   },
      //   headers: { "Content-Type": "application/json" }
      // }).then(async function(result){
      //     console.log("Status of Chat Closing " + result.data.status);
      // });
      if ($rootScope.open_form==false && $rootScope.open_chat==false){
        $rootScope.open_form = true;
        $rootScope.chat_val = "Close Chat";
      }
      else if($rootScope.open_chat == true){
        $http({
          method: 'POST',
          url: 'http://localhost:3000/endChatInstance',
          //url: 'http://10.12.205.128:3000/getRequiredCSAbeta',
          dataType: 'json',
          data:
          {
            department: $rootScope.user.department,
            jidOfAgent: $rootScope.contactJID
          },
          headers: { "Content-Type": "application/json" }
        }).then(async function(result){
            console.log("Status of Chat Closing " + result.data.status);
        });
        $rootScope.open_chat = false;
        console.log("closing chat");

        $rootScope.chat_val = "Open Chat";
      }
      else{
        $rootScope.open_form = false;
        $rootScope.open_chat = false;
        $rootScope.chat_val = "Open Chat";
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