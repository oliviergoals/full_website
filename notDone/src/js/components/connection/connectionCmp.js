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

    $http({
      method: 'GET',
      url: 'http://10.12.205.128:3000/createguest',
      
      }).then(function success(response) {
      // this function will be called when the request is success
      console.log("ZW success get Json")
      console.log("zw GuestID " + JSON.stringify(response.data.guestID));
      userAcc = response.data.guestID;
      userPw = response.data.guestPass;
      
      }, function error(response) {
      // this function will be called when the request returned error status
      console.log("ZW failed in getting json")
      
      });

      

    // var userAcc = "6lp5qhz767mcvo73eu49oiz76g0dfunp7ba4ij8d@619bb6404b6b11ea819a43cb4a9dae9b.sandbox.openrainbow.com";
    // var userPw = "|Hq4Frp0cT5eQYnmUQK9.Dl6Y6(W1a~2'`l3Bs)0";

    $scope.hosts = [
      {
        id: 0,
        value: "sandbox",
        name: "Rainbow Sandbox"
      },
    ];

    $scope.selectedItem = $scope.hosts[0];

    var handlers = [];
    
    //-----------------------------------------------
    $scope.submit_success = false;
    $scope.call = function () {
      $scope.server = angular.copy($scope.user);
      $scope.submit_success = true;
    }
    //-----------------------------------------------


    $scope.signin = function () {
      $scope.isLoading = true;

      saveToStorage();

      rainbowSDK.connection
        .signin(userAcc, userPw)
        .then(function (account) {
          console.log("[DEMO] :: Successfully signed!");
          $scope.isLoading = false;
          $scope.isConnected = true;
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
        $scope.user = { name: "", password: "" };
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
