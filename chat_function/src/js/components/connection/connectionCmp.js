angular.module("sample").component("rbxConnection", {
  bindings: {
    name: "@"
  },
  controller: function rbcConnectionCtrl(rainbowSDK, $rootScope, $scope, $http) {
    $scope.isConnected = false;

    $scope.isLoading = false;

    $scope.state = rainbowSDK.connection.getState();

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





// DONTTTT TOUCH THE CODE AT THE BOTTOM






      // -------------------------- Getting guestID through GET JSON  -------------------------------
      // $http({
      //   method: 'GET',
      //   url: 'http://10.12.205.128:3000/createguestdynamic?name=' + $scope.user.name,

      // }).then(function success(response) {
      //   // this function will be called when the request is success
      //   console.log("zw GuestID " + JSON.stringify(response.data.guestID));
      //   console.log("zw GuestPW " + JSON.stringify(response.data.guestPass));

      //   /* ----------------------- RainbowSDK sign in on success get JSON ---------------------------*/
      //   rainbowSDK.connection
      //     .signin(response.data.guestID, response.data.guestPass)
      //     .then(async function (account) {
      //       console.log("[DEMO] :: Successfully signed!");
      //       $scope.isLoading = false;
      //       $scope.isConnected = true;

      //       console.log("ZW, Successfully signed to Rainbow and the SDK is started completely");


      //       if ($scope.user.communication == "Chat") {
      //         var contactJId = "3006bf0f41a74dedb0c8e4da79b10be8@sandbox-all-in-one-rbx-prod-1.rainbow.sbg";
      //         var contactId = "5e3cd9e59f17bb3096c6a0c9";

      //         var selectedContact = await rainbowSDK.contacts.searchByJid(contactJId);
      //         // var selectedContact = await rainbowSDK.contacts.getContactById(contactId);

      //         console.log("zw before");
      //         console.log("zw " + selectedContact);

      //         //selectedContact
      //         rainbowSDK.conversations.openConversationForContact(selectedContact).then(function (conversation) {
      //           console.log("ZW enter");

      //           console.log("ZW Sent open conver");
      //           rainbowSDK.im.sendMessageToConversation(conversation, "Request support!!!!!");
      //           console.log("ZW Sent messgage");

      //         }).catch(function (err) {
      //           //Something when wrong with the server. Handle the trouble here
      //           console.log("ZW Error in opening conversation and sending")
      //         });

      //       }

      //     })
      //     .catch(function (err) {
      //       console.log("[DEMO] :: Error when sign-in", err);
      //       $scope.isLoading = false;
      //       $scope.isConnected = false;
      //     });

        //-------------------------- Retrieving post when successfully signed in  -------------------------------

        // $http({
        //   method: 'POST',
        //   url: 'http://10.12.128.232:3000/getRequiredCSA',
        //   dataType: 'json',
        //   data:
        //   {
        //     name: $scope.user.name,
        //     email: $scope.user.email,
        //     department: $scope.user.department,
        //     communication: $scope.user.communication,
        //     problem: $scope.user.problem
        //   },
        //   headers: { "Content-Type": "application/json" }
        // }).then(function success(response) {

        //   console.log("ZW success in posting and then received: " + response.data.result);
        //   // does logical check for queing status
        //   if (response.queueNumber != 0 && response.jid == null) {
        //     // means in waiting queue
        //   }
        //   else {
        //     // proceed to connect
        //     let allocatedCsaAgent = response.jid;
        //     // do your connecting things here ... 
        //   }

        // }, function error(response) {
        //   console.log("ZW failed in posting json")
        // });

        //-------------------------------------------------------------------------
        // if ($scope.user.communication == "Chat") {
        //   var contactJId = "3006bf0f41a74dedb0c8e4da79b10be8@sandbox-all-in-one-rbx-prod-1.rainbow.sbg";
        //   var contactId = "5e3cd9e59f17bb3096c6a0c9";

        //   var selectedContact = await rainbowSDK.contacts.searchByJid(contactJId);
        //   // var selectedContact = await rainbowSDK.contacts.getContactById(contactId);

        //   console.log("zw before");
        //   console.log("zw " + selectedContact);

        //   //selectedContact
        //   rainbowSDK.conversations.openConversationForContact(selectedContact).then(function (conversation) {
        //     console.log("ZW enter");

        //     console.log("ZW Sent open conver");
        //     rainbowSDK.im.sendMessageToConversation(conversation, "Request support!!!!!");
        //     console.log("ZW Sent messgage");

        //   }).catch(function (err) {
        //     //Something when wrong with the server. Handle the trouble here
        //     console.log("ZW Error in opening conversation and sending")
        //   });

        // }
        //-------------------------------------------------------------------------


      // }, function error(response) {
      //   // this function will be called when the request returned error status
      //   console.log("ZW failed in getting json");
      // });

      //-----------------------------------------------------------------------------

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