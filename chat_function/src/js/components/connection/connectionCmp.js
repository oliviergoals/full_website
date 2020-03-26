angular.module("sample").component("rbxConnection", {
  bindings: {
    name: "@"
  },
  controller: function rbcConnectionCtrl(rainbowSDK, $rootScope, $scope, $http, $interval) {
    $scope.isConnected = false;

    $scope.isLoading = false;

    // $scope.state = rainbowSDK.connection.getState();
    $scope.state = rainbowSDK.connection.getState();


    function rigorousPolling(queueValue){
      $http({
        method: 'POST',
        url: 'http://localhost:3000/checkQueueStatusbeta/',
        dataType: 'json',
        data:
        {
          name: $scope.user.name,
          email: $scope.user.email,
          department: $scope.user.department,
          communication: $scope.user.communication,
          problem: $scope.user.problem,
          queueNumber: queueValue
        },
        headers: { "Content-Type": "application/json" }
      }).then(function(result){
        return result;
      });
    }
    

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
    // TODO: Sheikh
    //-----------------------------------------------

    var contactJId;
    $scope.signin = function () {

      $scope.isLoading = true;

      saveToStorage();
      // ---------------------------------------------------------------------------

      $scope.server = angular.copy($scope.user);
      $scope.submit_success = true;
      choiceOfChat = $scope.user.communication;

      // The following code should be commented out WHEN TESTING AND NOT IN SCHOOL!
      $http({
        method: 'GET',
        url: 'http://localhost:3000/createguestdynamic?name=' + $scope.user.name,

      }).then(function success(response) {
        // this function will be called when the request is success
        console.log("zw GuestID " + JSON.stringify(response.data.guestID));
        console.log("zw GuestPW " + JSON.stringify(response.data.guestPass));

        /* ----------------------- RainbowSDK sign in on success get JSON ---------------------------*/
        rainbowSDK.connection
          .signin(response.data.guestID, response.data.guestPass)
          .then(async function (account) {
            console.log("[DEMO] :: Successfully signed!");
            $scope.isLoading = false;
            $scope.isConnected = true;
            $rootScope.open_form = false;
            $rootScope.open_chat = true;

            console.log("ZW, Successfully signed to Rainbow and the SDK is started completely. Proceeding to retrieve CSA");
            /* ---------------------- Retireving the right CSA via POST request --------------*/
            $http({
              method: 'POST',
              url: 'http://localhost:3000/getRequiredCSAbeta',
              dataType: 'json',
              data:
              {
                name: $scope.user.name,
                email: $scope.user.email,
                department: $scope.user.department,
                communication: $scope.user.communication,
                problem: $scope.user.problem
              },
              headers: { "Content-Type": "application/json" }
            }).then(async function (result) {
              console.log("retieved queueNumber " + result.data.queueNumber + " and jid " + result.data.jid);
              // does logical check for queuingstatus and JID returned
              let contactJID = result.data.jid;
              let queueStatus = result.data.queueNumber;
              if (contactJID != null)
              {
                let selectedContact = await rainbowSDK.contacts.searchByJid(result.data.jid);
                rainbowSDK.conversations.openConversationForContact(selectedContact).then(function (conversation) {
                  rainbowSDK.im.sendMessageToConversation(conversation, "Request support!!!!!");
                  console.log("ZW Sent messgage");
            
                  }).catch(function (err) {
                    //Something when wrong with the server. Handle the trouble here
                    console.log("ZW Error in opening conversation and sending")
                  });
              }
              // if no jid -> means not ready and on queue. So we do circular post ddos style
              else
              {
                let cassimir = $interval(
                  function() {
                    $http({
                      method: 'POST',
                      url: 'http://localhost:3000/checkQueueStatusbeta/',
                      dataType: 'json',
                      data:
                      {
                        name: $scope.user.name,
                        email: $scope.user.email,
                        department: $scope.user.department,
                        communication: $scope.user.communication,
                        problem: $scope.user.problem,
                        queueNumber: queueStatus
                      },
                      headers: { "Content-Type": "application/json" }
                    }).then(async function(result){
                       if (result.data.jid != null)
                       {
                         let newjid = result.data.jid;
                         let selectedContactRetry = await rainbowSDK.contacts.searchByJid(newjid);
                         rainbowSDK.conversations.openConversationForContact(selectedContactRetry).then(function (conversation1) {
                          rainbowSDK.im.sendMessageToConversation(conversation1, "Request support and this is queueed!!!!!");
                         
                   
                         }).catch(function (err) {
                           //Something when wrong with the server. Handle the trouble here
                           console.log("ZW Error in opening conversation and sending")
                         });
                         $interval.cancel(cassimir);
                         

                       }
                       else{
                         console.log("OMG PLS WORK FFS");
                         console.log(result.data.position);
                         // this part is where queue number update happens
                       }
                    });
                  },10000);
                  

              }

          }).catch(async function (err){
            console.log("[DEMO] :: Error when posting for CSA", err);
            // $scope.isLoading = false;
            // $scope.isConnected = false;
          })
          .catch(function (err) {
            console.log("[DEMO] :: Error when sign-in", err);
            // $scope.isLoading = false;
            // $scope.isConnected = false;
          });
        });
      }).catch(function(err){
        console.log("[DEMO] :: Error when getting login credentials", err);
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