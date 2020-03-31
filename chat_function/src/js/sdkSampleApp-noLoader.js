var sample = angular.module("sample", ["sdk"]);
// const {parse, stringify} = require('flatted/cjs');

sample.controller("sampleController", [
  "$rootScope",
  "rainbowSDK",
  "$http",
  "$window",
  "$scope",
  function($rootScope, sdk, $http, $window, $scope) {
    "use strict";    
    /*********************************************************/
    /**                INITIALIZATION STUFF                 **/
    /*********************************************************/
    $rootScope.chat_val = "Open Chat" 
    $rootScope.open_chat = false;
    $rootScope.open_form = false;  
    $rootScope.open_audio = false;
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

        //------------------- When Chat is open and press close chat, alert will be displayed   ---------------------------------
        const confirmedClose = $window.confirm("Are u sure you want to close the chat?\nClosing will end your chat with CAS!")
        if (confirmedClose) {
          console.log("pressed wanna close");

          //------------------------------- Post JSON to drop queue-----------------------------
          let blabla = sdk.conversations.getConversationById($rootScope.convoID_global);
          // console.log(convoHist);
          $http({
            method: 'POST',
            url: 'http://localhost:3000/endChatInstance',
            //url: 'http://10.12.205.128:3000/getRequiredCSAbeta',
            dataType: 'json',
            data:
            {
              department: $rootScope.user.department,
              jid: $rootScope.contactJID,
              queueNumber: $rootScope.queueStatus,
              convoID: $rootScope.convoID_global,
              detailsOfConvo: fuckCircularJson
            },
            headers: { "Content-Type": "application/json" }
          }).then(async function (result) {
            console.log("Status of Chat Closing " + result.data.status);
          });
          // ----------------------------------------------------------------  
          $rootScope.open_chat = false;
          console.log("closing chat");
          $rootScope.chat_val = "Open Chat";
        }
        else{
          console.log("wanna stay");
        }       
        //--------------------------------------------------------------------------
      }
      else{
        $rootScope.open_form = false;
        $rootScope.open_chat = false;
        $rootScope.chat_val = "Open Chat";
      }
      
    }
    

    // $scope.onExit = function() {
    //   return ('bye bye');
    // };

    document.addEventListener(sdk.RAINBOW_ONREADY, onReady);

    document.addEventListener(sdk.RAINBOW_ONLOADED, onLoaded);



    sdk.load();
    // $window.onbeforeunload =  $scope.onExit;
    // $window.onbeforeunload = function (event) {
    //   return 'Are you sure you want to leave without saving?';
    // }
    


    return true;
  }
]);