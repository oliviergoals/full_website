angular.module("sample").component("rbxConnection", {
    bindings: {
      name: "@"
    },
    controller: function rbcConnectionCtrl(rainbowSDK, $rootScope, $scope, $http) {
      $scope.isConnected = false;
  
      $scope.isLoading = false;
  
      // $scope.state = rainbowSDK.connection.getState();
      $scope.state = "Filling details";
  
      var userAcc
      var userPw;
  
  
      $scope.hosts = [
        {
          id: 0,
          value: "sandbox",
          name: "Rainbow Sandbox"
        },
      ];
  
      $scope.selectedItem = $scope.hosts[0];
  
      var handlers = [];
  
      $scope.submit_success = false;
  
      //-----------------------------------------------
  
      var contactJId;
      $scope.signin = function () {
  
        $scope.isLoading = true;
  
        saveToStorage();
        // ---------------------------------------------------------------------------
  
        $scope.server = angular.copy($scope.user);
        $scope.submit_success = true;
        choiceOfChat = $scope.user.communication;
  
  
        var guestID = "bot3@swaggy.com";
        var guestPass = "@Bot3password";
  
        rainbowSDK.connection
            .signin(guestID, guestPass)
            .then(async function (account) {
              console.log("[DEMO] :: Successfully signed!");
              $scope.isLoading = false;
              $scope.isConnected = true;
              $rootScope.open_form = false;
              console.log("form removed");
              $rootScope.open_chat = true;
              console.log("chat open");
              console.log("ZW, Successfully signed to Rainbow and the SDK is started completely");
  
  
              if ($scope.user.communication == "Chat") {
                var contactJId = "897970be03b5428a9d9dab1cd5872a66@sandbox-all-in-one-rbx-prod-1.rainbow.sbg";
                var contactId = "5e3cd9e59f17bb3096c6a0c9";
  
                var selectedContact = await rainbowSDK.contacts.searchByJid(contactJId);
                // var selectedContact = await rainbowSDK.contacts.getContactById(contactId);
  
                console.log("zw before");
                console.log("zw " + selectedContact);
  
                //selectedContact
                rainbowSDK.conversations.openConversationForContact(selectedContact).then(function (conversation) {
                  console.log("ZW enter");
  
                  console.log("ZW Sent open conver");
                  rainbowSDK.im.sendMessageToConversation(conversation, "Request support!!!!!");
                  console.log("ZW Sent messgage");
  
                }).catch(function (err) {
                  //Something when wrong with the server. Handle the trouble here
                  console.log("ZW Error in opening conversation and sending")
                });
  
              }
  
            })
            .catch(function (err) {
              console.log("[DEMO] :: Error when sign-in", err);
              $scope.isLoading = false;
              $scope.isConnected = false;
            });

  
        
  
      };
  
      $scope.signout = function () {
        $scope.isLoading = true;
        rainbowSDK.connection.signout().then(function () {
          $scope.isLoading = false;
          $scope.isConnected = false;
        });
      };
  
      var saveToStorage = function () {
        sessionStorage.connection = angular.toJson($scope.user);
        sessionStorage.host = angular.toJson($scope.selectedItem);
      };
  
      var readFromStorage = function () {
        if (sessionStorage.connection) {
          $scope.user = angular.fromJson(sessionStorage.connection);
        } else {
          // $scope.user = { name: "", password: "" };
        }
  
        if (sessionStorage.host) {
          $scope.selectedItem =
            $scope.hosts[angular.fromJson(sessionStorage.host).id];
        } else {
          $scope.selectedItem = $scope.hosts[0];
        }
      };
  
      var onConnectionStateChangeEvent = function onConnectionStateChangeEvent(
        event
      ) {
        $scope.state = rainbowSDK.connection.getState();
      };
  
      this.$onInit = function () {
        // Subscribe to XMPP connection change
        handlers.push(
          document.addEventListener(
            rainbowSDK.connection.RAINBOW_ONCONNECTIONSTATECHANGED,
            onConnectionStateChangeEvent
          )
        );
      };
  
      this.$onDestroy = function () {
        var handler = handlers.pop();
        while (handler) {
          handler();
          handler = handlers.pop();
        }
      };
  
      var initialize = function () {
        readFromStorage();
      };
  
      initialize();
    },
    templateUrl: "./src/js/components/connection/connectionCmp.template.html"
  });