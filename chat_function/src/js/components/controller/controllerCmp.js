angular.module("sample").component("rbxController", {
  // transclude: true,
  bindings: {
    name: "@"
  },
  templateUrl: "./src/js/components/controller/controllerCmp.template.html",
  controller: function rbcPhoneCtrl(rainbowSDK, $rootScope, $scope, Call, $timeout) {
    
    "use strict";

// ---------------------------------------------------------------------------

      var listeners = [];

      $scope.microphones = [];

      $scope.speakers = [];

      $scope.cameras = [];

      $scope.isChrome = navigator.userAgent.toLowerCase().indexOf("chrome") > -1;
      $scope.isFirefox =
        navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
      $scope.isOther = !($scope.isChrome || $scope.isFirefox);

      $timeout(function() {
        initialize();
      }, 1000);

      this.$onInit = function() {};

      var initialize = function initialize() {
        if ($scope.isChrome) {
          $rootScope.$broadcast("DEMO_ON_CHECK_DEVICES_START");

          // Enumerate the list of available media device
          navigator.mediaDevices
            .getUserMedia({ audio: true, video: true })
            .then(function(stream) {
              console.log("[DEMO] :: Get user media ok... Enumerate devices...");
              stream.getTracks().forEach(function(track) {
                track.stop();
              });
              navigator.mediaDevices
                .enumerateDevices()
                .then(gotDevices)
                .catch(handleError);
            })
            .catch(function(error) {
              console.log(
                "[DEMO] :: Unable to have access to media devices",
                error
              );
            });
        } else if ($scope.isFirefox) {
          $rootScope.$broadcast("DEMO_ON_CHECK_DEVICES_END");
        } else {
          $rootScope.$broadcast("DEMO_ON_CHECK_DEVICES_FAILED");
        }

        // Subscribe to WebRTC error
        listeners.push(
          document.addEventListener(
            rainbowSDK.webRTC.RAINBOW_ONWEBRTCERRORHANDLED,
            onWebRTCErrorHandled
          )
        );
      };

      var onWebRTCErrorHandled = function onWebRTCErrorHandled(event) {
        var error = event.detail;
        console.log("[DEMO] :: WebRTC Error", error);
        $rootScope.$broadcast("DEMO_ON_CHECK_DEVICES_END");
      };

      var gotDevices = function gotDevices(devices) {
        devices.forEach(function(device) {
          switch (device.kind) {
            case "audioinput":
              $scope.microphones.push(device);
              break;
            case "audiooutput":
              $scope.speakers.push(device);
              break;
            case "videoinput":
              $scope.cameras.push(device);
              break;
            default:
              console.log("Strange...", device);
              break;
          }
        });

        if ($scope.microphones.length === 0) {
          $scope.microphones.push({
            deviceId: "default",
            groupId: "2029518264",
            kind: "audioinput",
            label: "No microphone"
          });
        }

        if ($scope.speakers.length === 0) {
          $scope.speakers.push({
            deviceId: "default",
            groupId: "2029518264",
            kind: "audioinput",
            label: "No speaker"
          });
        }

        if ($scope.cameras.length === 0) {
          $scope.cameras.push({
            deviceId: "default",
            groupId: "2029518264",
            kind: "audioinput",
            label: "No camera"
          });
        }
        $scope.$apply(function() {
          $scope.selectedMicrophone = $scope.microphones[0];
          $scope.selectedSpeaker = $scope.speakers[0];
          $scope.selectedCamera = $scope.cameras[0];
        });

        $rootScope.$broadcast("DEMO_ON_CHECK_DEVICES_END");
      };

      var handleError = function handleError(error) {
        console.log("[DEMO] :: Devices error", error);
        $rootScope.$broadcast("DEMO_ON_CHECK_DEVICES_END");
      };


// // ---------------------------------------------------------------------------

    $scope.isConnected = false;

    $scope.isInCommunication = false;

    // $scope.isPIPDisplayed = true;

    // $scope.isRemoteVideoDisplayed = true;

    // $scope.isSpectrumDisplayed = false;

    // $scope.hasLocalVideo = false; //Compute local

    // $scope.hasRemoteVideo = false; // compute remote

    // $scope.isCheckedDisplayed = true;

    $scope.title = "Please wait...";

    $scope.message = "The browser is checking your audio and video devices";

    var currentCall = null;

    this.$onInit = function() {
      // Subscribe to XMPP connection change
      document.addEventListener(
        rainbowSDK.connection.RAINBOW_ONCONNECTIONSTATECHANGED,
        onConnectionStateChangeEvent
      );

      document.addEventListener(
        rainbowSDK.webRTC.RAINBOW_ONWEBRTCCALLSTATECHANGED,
        onWebRTCCallChanged
      );

      document.addEventListener(
        rainbowSDK.webRTC.RAINBOW_ONWEBRTCTMEDIAERROROCCURED,
        onWebRTCGetUserMediaErrorOccured
      );

      // document.addEventListener(
      //   rainbowSDK.webRTC.RAINBOW_ONWEBRTCTRACKCHANGED,
      //   onWebRTCTrackChanged
      // );

      // document.addEventListener(
      //   rainbowSDK.webRTC.RAINBOW_ONCONVERSATIONCHANGED,
      //   onConversationChanged
      // );

      $rootScope.$on("DEMO_ON_CHECK_DEVICES_START", onDeviceCheckStart);

      $rootScope.$on("DEMO_ON_CHECK_DEVICES_END", onDeviceCheckEnd);

      $rootScope.$on("DEMO_ON_CHECK_DEVICES_FAILED", onDeviceCheckFailed);
    };

    this.$onDestroy = function() {};

    var onDeviceCheckStart = function onDeviceCheckStart() {
      console.log("[DEMO] :: Start checking devices...");
    };

    var onDeviceCheckEnd = function onDeviceCheckEnd() {
      $scope.$apply(function() {
        console.log("[DEMO] :: Devices checking finished!");
        $scope.isCheckedDisplayed = false;
      });
    };

    var onDeviceCheckFailed = function onDeviceCheckFailed() {
      $scope.title = "WARNING !";
      $scope.message =
        "This demo will not work on this browser (not compatible)";
    };

    // var onConversationChanged = function onConversationChanged(event) {
    //   var conversation = event.detail;
    //   console.log("[DEMO] :: Conversation changed", conversation);
    // };

    var onConnectionStateChangeEvent = function onConnectionStateChangeEvent(
      event
    ) {
      var status = event.detail;
      if (status === rainbowSDK.connection.RAINBOW_CONNECTIONCONNECTED) {
        $scope.isConnected = true;
      } else if (
        status === rainbowSDK.connection.RAINBOW_CONNECTIONDISCONNECTED
      ) {
        $scope.isConnected = false;
      }
    };

    // var onWebRTCGetUserMediaErrorOccured = function onWebRTCGetUserMediaErrorOccured(
    //   event
    // ) {
    //   var error = event.detail;
    //   console.log("[DEMO] :: WebRTC GetUserMedia error occurs", error);
    // };

    var onWebRTCCallChanged = function onWebRTCCallChanged(event, call) {
      var call = event.detail;
      console.log(
        "[DEMO] :: WebRTC Call state changed to " + call.status.value,
        call
      );

      switch (call.status.value) {
        case Call.Status.RINGING_INCOMMING.value:
          if (call.remoteMedia & Call.Media.VIDEO) {
            answerInVideo(call);
          } else {
            answerInAudio(call);
          }
          break;

        case Call.Status.ACTIVE.value:
          if (call.remoteMedia & Call.Media.VIDEO) {
            displayRemoteVideo(call);
          } else {
            hideRemoteVideo(call);
          }

          if (call.localMedia & Call.Media.VIDEO) {
            displayLocalVideo(call);
          } else {
            hideLocalVideo(call);
          }
          $scope.isInCommunication = true;
          break;

        case Call.Status.UNKNOWN.value:
          hideLocalVideo();
          hideRemoteVideo(call);
          $scope.isInCommunication = false;
          break;

        default:
          console.log("[DEMO] :: Nothing to do with that event...");
          break;
      }

      currentCall = call;
    };

    // var onWebRTCTrackChanged = function onWebRTCTrackChanged(event) {
    //   var call = event.detail;
    //   console.log(
    //     "[DEMO] :: WebRTC Track changed local|remote " +
    //       call.localMedia +
    //       "|" +
    //       call.remoteMedia
    //   );
    //   // Manage remote video
    //   if (call.remoteMedia & Call.Media.VIDEO) {
    //     displayRemoteVideo(call);
    //   } else {
    //     hideRemoteVideo(call);
    //   }
    //   // Manage local video
    //   if (call.localMedia & Call.Media.VIDEO) {
    //     displayLocalVideo(call);
    //   } else {
    //     hideLocalVideo(call);
    //   }
    // };

    // var answerInVideo = function answerInVideo(call) {
    //   console.log("[DEMO] :: Answer in video");
    //   rainbowSDK.webRTC.answerInVideo(call);
    // };

    var answerInAudio = function answerInAudio(call) {
      console.log("[DEMO] :: Answer in audio");
      rainbowSDK.webRTC.answerInAudio(call);
    };

    // var displayRemoteVideo = function displayRemoteVideo(call) {
    //   console.log("[DEMO] :: Display remote video");
    //   rainbowSDK.webRTC.showRemoteVideo(call);
    //   $scope.hasRemoteVideo = true;
    // };

    // var hideRemoteVideo = function hideRemoteVideo(call) {
    //   console.log("[DEMO] :: Hide remote video");
    //   rainbowSDK.webRTC.hideRemoteVideo(call);
    //   $scope.hasRemoteVideo = false;
    // };

    // var displayLocalVideo = function displayLocalVideo() {
    //   console.log("[DEMO] :: Display local video");
    //   rainbowSDK.webRTC.showLocalVideo();
    //   $scope.hasLocalVideo = true;
    // };

    // var hideLocalVideo = function hideLocalVideo() {
    //   console.log("[DEMO] :: Hide local video");
    //   rainbowSDK.webRTC.hideLocalVideo();
    //   $scope.hasLocalVideo = false;
    // };

    // $scope.hidePIP = function hidePIP() {
    //   rainbowSDK.webRTC.hideLocalVideo();
    //   $scope.isPIPDisplayed = false;
    // };

    // $scope.showPIP = function showPIP() {
    //   rainbowSDK.webRTC.showLocalVideo();
    //   $scope.isPIPDisplayed = true;
    // };

    // $scope.hideRemote = function hideRemote() {
    //   rainbowSDK.webRTC.hideRemoteVideo(currentCall);
    //   $scope.isRemoteVideoDisplayed = false;
    // };

    // $scope.showRemote = function showRemote() {
    //   rainbowSDK.webRTC.showRemoteVideo(currentCall);
    //   $scope.isRemoteVideoDisplayed = true;
    // };

    // $scope.addVideo = function addVideo() {
    //   rainbowSDK.webRTC.addVideoToCall(currentCall);
    // };

    // $scope.removeVideo = function removeVideo() {
    //   rainbowSDK.webRTC.removeVideoFromCall(currentCall);
    // };

    $scope.release = function release() {
      rainbowSDK.webRTC.release(currentCall);
    };

    // $scope.showSpectrum = function showSpectrum() {
    //   $scope.isSpectrumDisplayed = true;
    //   $rootScope.$broadcast(
    //     "DEMO_ON_SPECTRUM_DISPLAY",
    //     $scope.isSpectrumDisplayed
    //   );
    // };

    // $scope.hideSpectrum = function hideSpectrum() {
    //   $scope.isSpectrumDisplayed = false;
    //   $rootScope.$broadcast(
    //     "DEMO_ON_SPECTRUM_DISPLAY",
    //     $scope.isSpectrumDisplayed
    //   );
    // };

    $scope.mute = function mute() {
      var conversationId = currentCall.conversationId;
      var conversation = rainbowSDK.conversations.getConversationById(
        conversationId
      );

      if (conversation) {
        rainbowSDK.webRTC.muteVideoCall(conversation);
        $scope.isMuted = true;
      }
    };

    $scope.unmute = function unmute() {
      var conversationId = currentCall.conversationId;
      var conversation = rainbowSDK.conversations.getConversationById(
        conversationId
      );

      if (conversation) {
        rainbowSDK.webRTC.unmuteVideoCall(conversation);
        $scope.isMuted = false;
      }
    };
  }
});
