var sample = angular.module("sample", ["sdk", 'ngAnimate','vcRecaptcha']);
// const {parse, stringify} = require('flatted/cjs');
//var stringify = require('json-stringify-safe');

sample.controller("sampleController", [
  "$rootScope",
  "rainbowSDK",
  "$http",
  "$window",
  "$scope",
  function($rootScope, sdk, $http, $window, $scope, vcRecaptchaService ) {
    "use strict";    
    /*********************************************************/
    /**                INITIALIZATION STUFF                 **/
    /*********************************************************/
    

    $rootScope.chat_val = false; //"open chat"
    $rootScope.open_chat = false;
    $rootScope.open_form = false;  
    $rootScope.open_audio = false;
    $rootScope.open_video = false;
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

    
    /*********************************************************/
    /**                  PARSING STUFF                      **/
    /*********************************************************/
    $scope.stringify = function(obj, replacer, spaces, cycleReplacer) {
      return JSON.stringify(obj, serializer(replacer, cycleReplacer), spaces)
    }
    
    function serializer(replacer, cycleReplacer) {
      var stack = [], keys = []
      
      if (cycleReplacer == null) cycleReplacer = function(key, value) {
        if (stack[0] === value) return "[Circular ~]"
        return "[Circular ~." + keys.slice(0, stack.indexOf(value)).join(".") + "]"
      }
      
      return function(key, value) {
        if (stack.length > 0) {
          var thisPos = stack.indexOf(this)
          ~thisPos ? stack.splice(thisPos + 1) : stack.push(this)
          ~thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key)
          if (~stack.indexOf(value)) value = cycleReplacer.call(this, key, value)
        }
        else stack.push(value)
        
        return replacer == null ? value : replacer.call(this, key, value)
      }
    }
    /*********************************************************/
    /**                  PARSING STUFF                      **/
    /*********************************************************/
    


    // TODO: Shake
    $rootScope.butt_val_changer = function(){  
      console.log("button pressed");    
      // $http({
      //   method: 'POST',
        // url: 'https://localhost:3000/endChatInstance',
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
      if ($rootScope.open_form==false && $rootScope.open_chat==false && $rootScope.open_audio==false && $rootScope.open_video == false){
        $rootScope.open_form = true;
        $rootScope.chat_val = true; //"close chat"
      }
      else if($rootScope.open_chat == true || $rootScope.open_audio == true || $rootScope.open_video==true){
        console.log("this is the value of open chat" +$rootScope.open_chat );
        console.log("this is the value of open audio" +$rootScope.open_audio );
        console.log("this is the value of open video" +$rootScope.open_video );

        //------------------- When Chat is open and press close chat, alert will be displayed   ---------------------------------
        const confirmedClose = $window.confirm("Are u sure you want to close the chat?\nClosing will end your chat with CAS!")
        if (confirmedClose) {
          if($rootScope.open_chat == true){
            let convoHist = sdk.conversations.getConversationById($rootScope.convoID_global).messages;
            console.log(convoHist);
            //let convoHistFlat = $window.Flatted.Flatted.parse(convoHist)
            let convoHistFlat = $scope.stringify(convoHist);
            console.log(convoHistFlat);
            $scope.convoHistFlatFinal = convoHistFlat;}
          else if($rootScope.open_audio == true || $rootScope.open_video==true){
            rainbowSDK.webRTC.release($rootScope.currentCallR);
          }
          $http({
            method: 'POST',
            url: 'https://poc-open-rainbow-swaggy.herokuapp.com/routing/endChatInstance',
            //url: 'https://10.12.205.128:3000/routing/getRequiredCSAbeta',
            dataType: 'json',
            data:
            {
              department: $rootScope.user.department,
              jid: $rootScope.contactJID,
              queueNumber: $rootScope.queueNumber,
              convoID: $rootScope.convoID_global,
              detailsOfConvo: $scope.convoHistFlatFinal,
              flag: false
            },
            headers: { "Content-Type": "application/json" }
          }).then(async function (result) {
            console.log("Status of Chat Closing " + result.data.status);
          });
          // ----------------------------------------------------------------  
          $rootScope.open_chat = false;
          $rootScope.open_audio = false;
          $rootScope.open_video = false;
          console.log("closing chat");
          $rootScope.chat_val = false; //"open chat"
          
        }
        else{
          console.log("wanna stay");
        }       
        //--------------------------------------------------------------------------
      }
      else{
        $rootScope.open_form = false;
        $rootScope.open_chat = false;
        $rootScope.chat_val = false; //"Open Chat"
      }
      
    }

    window.addEventListener('beforeunload', function (e) { 
      if($rootScope.open_chat == true || $rootScope.open_audio == true || $rootScope.open_video==true || $rootScope.submit_success == true){
      e.preventDefault(); 
      $scope.closeWindow();}
  }); 

    $scope.closeWindow = function(){
        console.log("pressed wanna close");
          //------------------------------- Post JSON to drop queue-----------------------------
          if($rootScope.open_chat == true){
          let convoHist = sdk.conversations.getConversationById($rootScope.convoID_global).messages;
          console.log(convoHist);
            //let convoHistFlat = $window.Flatted.Flatted.parse(convoHist)
          var convoHistFlat = $scope.stringify(convoHist);
          console.log(convoHistFlat);
          var flag = false;
          // $scope.convoHistFlatFinal = convoHistFlat;
          // console.log($scope.convoHistFlatFinal);
        }
        else if($rootScope.open_audio == true || $rootScope.open_video==true){
          rainbowSDK.webRTC.release($rootScope.currentCallR);
          var flag = false;
        }
        else if( $rootScope.submit_success == true){
          var flag = true;
        }

          // console.log(convoHist);
          $http({
            method: 'POST',
            url: 'https://poc-open-rainbow-swaggy.herokuapp.com/routing/endChatInstance',
            // url: 'https://localhost:3000/routing/endChatInstance',
            //url: 'https://10.12.205.128:3000/routing/getRequiredCSAbeta',
            dataType: 'json',
            data:
            {
              department: $rootScope.user.department,
              jid: $rootScope.contactJID,
              queueNumber: $rootScope.queueNumber,
              convoID: $rootScope.convoID_global,
              detailsOfConvo: convoHistFlat,
              flag: flag
            },
            headers: { "Content-Type": "application/json" }
          }).then(async function (result) {
            console.log("Status of Chat Closing " + result.data.status);
          });
          // ----------------------------------------------------------------  
          
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

sample.directive('ngEnter', function() {
  return function(scope, element, attrs) {
      element.bind("keydown", function(e) {
          if(e.which === 13) {
              scope.$apply(function(){
                  scope.$eval(attrs.ngEnter, {'e': e});
              });
              e.preventDefault();
          }
      });
  };
});

sample.directive('scrollBottom', function () {
  return {
    scope: {
      scrollBottom: "="
    },
    link: function (scope, element) {
      scope.$watchCollection('scrollBottom', function (newValue) {
        if (newValue)
        {
          $(element).scrollTop($(element)[0].scrollHeight);
        }
      });
    }
  }
})

    /*********************************************************/
    /**                Parsing stuff                        **/
    /*********************************************************/
    
  // $scope.parse = function(text, reviver) {
  //   var input = JSON.parse(text, Primitives).map(primitives);
  //   var value = input[0];
  //   var $ = reviver || noop;
  //   var tmp = typeof value === 'object' && value ?
  //               revive(input, new Set, value, $) :
  //               value;
  //   return $.call({'': tmp}, '', tmp);
  //   }

  //   function noop(key, value) {
  //     return value;
  //   }
  
  //   function revive(input, parsed, output, $) {
  //     return Object.keys(output).reduce(
  //       function (output, key) {
  //         var value = output[key];
  //         if (value instanceof Primitive) {
  //           var tmp = input[value];
  //           if (typeof tmp === 'object' && !parsed.has(tmp)) {
  //             parsed.add(tmp);
  //             output[key] = $.call(output, key, revive(input, parsed, tmp, $));
  //           } else {
  //             output[key] = $.call(output, key, tmp);
  //           }
  //         } else
  //           output[key] = $.call(output, key, value);
  //         return output;
  //       },
  //       output
  //     );
  //   }
  
  //   function set(known, input, value) {
  //     var index = Primitive(input.push(value) - 1);
  //     known.set(value, index);
  //     return index;
  //   }
  
    // the two kinds of primitives
    //  1. the real one
    //  2. the wrapped one
  
    // function primitives(value) {
    //   return value instanceof Primitive ? Primitive(value) : value;
    // }
  
    // function Primitives(key, value) {
    //   return typeof value === primitive ? new Primitive(value) : value;
    // }