angular.module("sample").component("rbxController", {
  bindings: {
    name: "@"
  },
  templateUrl: "./src/js/components/controller/controllerCmp.template.html",
  controller: function rbcPhoneCtrl(rainbowSDK, $rootScope, $scope, Call, $window, $http) {
    "use strict";

    $scope.isConnected = false;

    $scope.isInCommunication = false;

    $scope.isPIPDisplayed = true;

    $scope.isRemoteVideoDisplayed = true;

    $scope.isSpectrumDisplayed = false;

    $scope.hasLocalVideo = false; //Compute local

    $scope.hasRemoteVideo = false; // compute remote

    $scope.isCheckedDisplayed = true;

    $scope.title = "Please wait...";

    $scope.message = "The browser is checking your audio and video devices";

    console.log("scope has been initiated");

    // -----------------------------------------------

    // console.log( $rootScope.open_audio + " open_aud val changed");
    // console.log( $scope.showAudio + " showAud val has changed");
    // console.log( $scope.callType +  "Calltype has changed");

    //-----------------------------------------------

    var currentCall = null;
    $rootScope.currentCallR;

    this.$onInit = function () {


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

      document.addEventListener(
        rainbowSDK.webRTC.RAINBOW_ONWEBRTCTRACKCHANGED,
        onWebRTCTrackChanged
      );

      document.addEventListener(
        rainbowSDK.webRTC.RAINBOW_ONCONVERSATIONCHANGED,
        onConversationChanged
      );

      document.addEventListener(
        rainbowSDK.callsLog.RAINBOW_ONCALLLOGUPDATED,
        onCallLogUpdated
      );

      $rootScope.$on("DEMO_ON_CHECK_DEVICES_START", onDeviceCheckStart);

      $rootScope.$on("DEMO_ON_CHECK_DEVICES_END", onDeviceCheckEnd);

      $rootScope.$on("DEMO_ON_CHECK_DEVICES_FAILED", onDeviceCheckFailed);
    };

    this.$onDestroy = function () { };

    var onCallLogUpdated = function onCallLogUpdated() {
      var logHistory = rainbowSDK.callsLog.getAll();
      // Do something with the log history
      $scope.callHis = logHistory;
    };

    var onDeviceCheckStart = function onDeviceCheckStart() {
      console.log("[DEMO] :: Start checking devices...");
    };

    var onDeviceCheckEnd = function onDeviceCheckEnd() {
      $scope.$apply(function () {
        console.log("[DEMO] :: Devices checking finished!");
        $scope.isCheckedDisplayed = false;
      });
    };

    var onDeviceCheckFailed = function onDeviceCheckFailed() {
      $scope.title = "WARNING !";
      $scope.message =
        "This demo will not work on this browser (not compatible)";
    };

    var onConversationChanged = function onConversationChanged(event) {
      var conversation = event.detail;
      console.log("[DEMO] :: Conversation changed", conversation);
    };

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

    var onWebRTCGetUserMediaErrorOccured = function onWebRTCGetUserMediaErrorOccured(
      event
    ) {
      var error = event.detail;
      console.log("[DEMO] :: WebRTC GetUserMedia error occurs", error);
    };

    var onWebRTCCallChanged = function onWebRTCCallChanged(event, call) {
      var call = event.detail;
      console.log($rootScope.callType + "scope call type");
      console.log($rootScope.open_audio + "scope audio type");
      console.log($scope.isInCommunication + "scope comm type");

      console.log(
        "[DEMO] :: WebRTC Call state changed to " + call.status.value,
        call
      );


      // when CSA release call
      if (call.status.value === "Unknown") {
        console.log("csa release call");
        $http({
          method: 'POST',
          url: 'https://poc-open-rainbow-swaggy.herokuapp.com/routing/endChatInstance',
          dataType: 'json',
          data:
          {
            department: $rootScope.user.department,
            communication: $rootScope.user.communication,
            queueNumber: $rootScope.queueNumber,
            jid: $rootScope.contactJID,
            convoHistory: "No history",
            clientEmail: $rootScope.user.email,
            queueDropped: false,
            ticketNumber: $rootScope.ticketNumber
          },
          headers: { "Content-Type": "application/json" }
        }).then(async function (result) {
          console.log("Status of Chat Closing " + result.data.status);
        });
        $rootScope.open_audio = false;
        $rootScope.open_video = false;
        console.log("closing chat");
        $rootScope.chat_val = false; //"open chat"

      }

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
          console.log($scope.isInCommunication + "scope comm type");
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
      $rootScope.currentCallR = call;
    };

    var onWebRTCTrackChanged = function onWebRTCTrackChanged(event) {
      var call = event.detail;
      console.log(
        "[DEMO] :: WebRTC Track changed local|remote " +
        call.localMedia +
        "|" +
        call.remoteMedia
      );
      // Manage remote video
      if (call.remoteMedia & Call.Media.VIDEO) {
        displayRemoteVideo(call);
      } else {
        hideRemoteVideo(call);
      }
      // Manage local video
      if (call.localMedia & Call.Media.VIDEO) {
        displayLocalVideo(call);
      } else {
        hideLocalVideo(call);
      }
    };

    var answerInVideo = function answerInVideo(call) {
      console.log("[DEMO] :: Answer in video");
      rainbowSDK.webRTC.answerInVideo(call);
    };

    var answerInAudio = function answerInAudio(call) {
      console.log("[DEMO] :: Answer in audio");
      rainbowSDK.webRTC.answerInAudio(call);
    };

    var displayRemoteVideo = function displayRemoteVideo(call) {
      console.log("[DEMO] :: Display remote video");
      rainbowSDK.webRTC.showRemoteVideo(call);
      $scope.hasRemoteVideo = true;
    };

    var hideRemoteVideo = function hideRemoteVideo(call) {
      console.log("[DEMO] :: Hide remote video");
      rainbowSDK.webRTC.hideRemoteVideo(call);
      $scope.hasRemoteVideo = false;
    };

    var displayLocalVideo = function displayLocalVideo() {
      console.log("[DEMO] :: Display local video");
      rainbowSDK.webRTC.showLocalVideo();
      $scope.hasLocalVideo = true;
    };

    var hideLocalVideo = function hideLocalVideo() {
      console.log("[DEMO] :: Hide local video");
      rainbowSDK.webRTC.hideLocalVideo();
      $scope.hasLocalVideo = false;
    };

    $scope.hidePIP = function hidePIP() {
      rainbowSDK.webRTC.hideLocalVideo();
      $scope.isPIPDisplayed = false;
    };

    $scope.showPIP = function showPIP() {
      rainbowSDK.webRTC.showLocalVideo();
      $scope.isPIPDisplayed = true;
    };

    $scope.hideRemote = function hideRemote() {
      rainbowSDK.webRTC.hideRemoteVideo(currentCall);
      $scope.isRemoteVideoDisplayed = false;
    };

    $scope.showRemote = function showRemote() {
      rainbowSDK.webRTC.showRemoteVideo(currentCall);
      $scope.isRemoteVideoDisplayed = true;
    };

    $scope.addVideo = function addVideo() {
      rainbowSDK.webRTC.addVideoToCall(currentCall);
    };

    $scope.removeVideo = function removeVideo() {
      rainbowSDK.webRTC.removeVideoFromCall(currentCall);
    };

    $scope.release = function release() {
      console.log("release button pressed");
      const confirmedClose = $window.confirm("Are u sure you want to end the call?\nClosing will end your chat with " + $rootScope.csaName)
      if (confirmedClose) {
        rainbowSDK.webRTC.release(currentCall);
        console.log("pressed wanna close");

        console.log("changed");
        let blabla = rainbowSDK.conversations.getConversationById($rootScope.convoID_global);
        $http({
          method: 'POST',
          url: 'https://poc-open-rainbow-swaggy.herokuapp.com/routing/endChatInstance',
          dataType: 'json',
          data:
          {
            department: $rootScope.user.department,
            communication: $rootScope.user.communication,
            queueNumber: $rootScope.queueNumber,
            jid: $rootScope.contactJID,
            convoHistory: "No history",
            clientEmail: $rootScope.user.email,
            queueDropped: false,
            ticketNumber: $rootScope.ticketNumber
          },
          headers: { "Content-Type": "application/json" }
        }).then(async function (result) {
          console.log("Status of Chat Closing " + result.data.status);
        });
        $rootScope.open_audio = false;
        $rootScope.open_video = false;
        console.log("closing chat");
        $rootScope.chat_val = false; //"open chat"
      };
    }

    $scope.showSpectrum = function showSpectrum() {
      $scope.isSpectrumDisplayed = true;
      $rootScope.$broadcast(
        "DEMO_ON_SPECTRUM_DISPLAY",
        $scope.isSpectrumDisplayed
      );
    };

    $scope.hideSpectrum = function hideSpectrum() {
      $scope.isSpectrumDisplayed = false;
      $rootScope.$broadcast(
        "DEMO_ON_SPECTRUM_DISPLAY",
        $scope.isSpectrumDisplayed
      );
    };

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
