angular.module("sample").component("rbxConnection", {
  bindings: {
    name: "@",
  },

  controller: function rbcConnectionCtrl(rainbowSDK, $rootScope, $scope, $http, $interval, $window, vcRecaptchaService) {
    $scope.isConnected = false;
    $scope.isLoading = false;
    $scope.queueInFront = "none";
    $scope.queueStatus = "none";
    $scope.form = false;
    $scope.introduction = true;
    $scope.response = null;
    $scope.widgetId = null;
    $scope.gRecaptchaResponse = false;


    $scope.user = {
      name: null,
      email: null,
      department: null,
      communication: null,
      problem: null,
    };

    console.log("reached");
    $scope.model = {
      key: '6LddGecUAAAAAOrgzaN55luxwze-M9EQUXz8THWS'
    };

    $scope.setResponse = function (response) {
      console.info('Response available');
      $scope.response = response;
      $scope.gRecaptchaResponse = true;
    };

    $scope.setWidgetId = function (widgetId) {
      console.info('Created widget ID: %s', widgetId);
      $scope.widgetId = widgetId;
    };

    $scope.cbExpiration = function () {
      console.info('Captcha expired. Resetting response object');
      vcRecaptchaService.reload($scope.widgetId);
      $scope.response = null;
    };

    //     $scope.submit = function () {
    //         var valid;

    //         /**
    //          * SERVER SIDE VALIDATION
    //          *
    //          * You need to implement your server side validation here.
    //          * Send the reCaptcha response to the server and use some of the server side APIs to validate it
    //          * See https://developers.google.com/recaptcha/docs/verify
    //          */
    //         console.log('sending the captcha response to the server', $scope.response);

    //         if (valid) {
    //             console.log('Success');
    //         } else {
    //             console.log('Failed validation');

    //             // In case of a failed validation you need to reload the captcha
    //             // because each response can be checked just once
    //             vcRecaptchaService.reload($scope.widgetId);
    //         }
    //     };
    // });

    $scope.read_intro = function () {
      console.log("button pressed")
      $scope.form = true;
      $scope.introduction = false;
    }

    // $scope.state = rainbowSDK.connection.getState();
    $scope.state = rainbowSDK.connection.getState();


    function rigorousPolling(queueValue) {
      $http({
        method: 'POST',
        // url: 'http://localhost:3000/routing/checkQueueStatus/',
        url: 'https://poc-open-rainbow-swaggy.herokuapp.com/routing/checkQueueStatus',
        dataType: 'json',
        data:
        {
          name: $scope.user.name,
          email: $rootScope.user.email,
          department: $rootScope.user.department,
          communication: $rootScope.user.communication,
          problem: $scope.user.problem,
          queueNumber: queueValue
        },
        headers: { "Content-Type": "application/json" }
      }).then(function (result) {
        return result;
      });
    }


    $scope.hosts = [
      {
        id: 0,
        value: "sandbox",
        name: "Rainbow Sandbox"
      },
    ];

    $scope.selectedItem = $scope.hosts[0];

    var handlers = [];

    $rootScope.submit_success = false;
    // TODO: Sheikh
    //-----------------------------------------------

    //let flatten = $window.Flatted.stringify()

    $scope.signin = function () {
      $rootScope.queueNumber = "";
      $scope.queueInFront = "";
      $scope.isLoading = true;
      $rootScope.submit_success = true;

      saveToStorage();
      // ---------------------------------------------------------------------------

      $scope.server = angular.copy($scope.user);
      let choiceOfChat = $rootScope.user.communication;
      console.log($rootScope.user.email);
      console.log($rootScope.user.communication);
      console.log($rootScope.user.department);
      console.log("passssssssssssssssssssssssssssssssssssssssssss")


      // //----------------------------------------------------------
      // rainbowSDK.connection
      //   .signin("tinkit@swaggy.com", "@Tinkit123")
      //   .then(async function (account) { 



      //     console.log("choose audio");
      //     let callPersonJID = "4c33fa55637949768b4d2dbc417c69da@sandbox-all-in-one-rbx-prod-1.rainbow.sbg";
      //     let callPersonCont =  await rainbowSDK.contacts.searchByJid(callPersonJID);


      //     // $http({
      //     //   method: 'GET',
      //     //   // url: 'http://localhost:3000/createguestdynamic?name=' + $scope.user.name,
      //     //   url: 'http://10.12.205.128:3000/createguestdynamic?name=' + "testname",
      //     // }).then(function success(response) {
      //     //   // this function will be called when the request is success
      //     //   console.log("zw GuestID " + JSON.stringify(response.data.guestID));
      //     //   console.log("zw GuestPW " + JSON.stringify(response.data.guestPass));
      //     // }).catch(function(err){
      //     //   console.log("fail to post");
      //     // })

      //     if(choiceOfChat == "Audio"){
      //       $rootScope.open_audio = "true";
      //       if (rainbowSDK.webRTC.canMakeAudioVideoCall()) {
      //         console.log("before call");
      //         rainbowSDK.webRTC.callInAudio(callPersonCont);
      //         console.log("after call");
      //       } else {
      //         console.log("DEMO :: Your browser can't make audio and video call!");
      //         console.log("after ur browser cannot call");
      //       };
      //     }
      //     else if(choiceOfChat == "Video"){
      //       $rootScope.open_video = true;
      //       if (rainbowSDK.webRTC.canMakeAudioVideoCall()) {
      //         rainbowSDK.webRTC.callInVideo(callPersonCont);
      //       } else {
      //         console.log("DEMO :: Your browser can't make audio and video call!");
      //       };
      //     }



      //   })
      //   .catch(function (err) {
      //     console.log("[DEMO] :: Error when sign-in", err);
      //     // $scope.isLoading = false;
      //     // $scope.isConnected = false;
      //   });





      //----------------------------------------------------------






      // The following code should be commented out WHEN TESTING AND NOT IN SCHOOL!
      $http({
        method: 'GET',
        // url: 'http://localhost:3000/routing/createguestdynamic?name=' + $scope.user.name,
        url: 'https://poc-open-rainbow-swaggy.herokuapp.com/routing/createguestdynamic?name=' + $scope.user.name,

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

            console.log("ZW, Successfully signed to Rainbow and the SDK is started completely. Proceeding to retrieve CSA");
            /* ---------------------- Retireving the right CSA via POST request --------------*/

            $http({
              method: 'POST',
              // url: 'http://localhost:3000/routing/getRequiredCSA',
              url: 'https://poc-open-rainbow-swaggy.herokuapp.com/routing/getRequiredCSA',
              dataType: 'json',
              data:
              {
                name: $scope.user.name,
                email: $rootScope.user.email,
                department: $rootScope.user.department,
                communication: $rootScope.user.communication,
                problem: $scope.user.problem
              },
              headers: { "Content-Type": "application/json" }
            }).then(async function (result) {
              console.log("retieved queueNumber " + result.data.queueNumber + " and jid " + result.data.jid);
              // does logical check for queuingstatus and JID returned
              let contactJID = result.data.jid;
              let queueNumber = result.data.queueNumber;
              let queueStatus = result.data.queueStatus;
              $rootScope.queueNumber = result.data.queueNumber;
              $rootScope.contactJID = result.data.jid;
              console.log("this is queue status " + queueStatus);
              if (result.data.queueStatus === "ready" && result.data.jid != null) {
                let selectedContact = await rainbowSDK.contacts.searchByJid(result.data.jid);
                $scope.queueInFront = "It's You're Turn!"
                console.log("this is queue status " + $scope.queueInFront);
                $rootScope.csaName = selectedContact.firstname;
                console.log($rootScope.csaName + "this is csa name");

                if (choiceOfChat == "Chat") {
                  rainbowSDK.conversations.openConversationForContact(selectedContact).then(function (conversation) {
                    console.log("zzzzzz");
                    console.log(conversation);
                    console.log("converstation id: " + conversation.id);
                    $rootScope.convoID_global = conversation.id;

                    $rootScope.open_form = false;
                    $rootScope.open_chat = true;
                    $rootScope.submit_success = false;
                    rainbowSDK.im.sendMessageToConversation(conversation, $scope.user.problem);
                    console.log("ZW Sent messgage");

                  }).catch(function (err) {
                    //Something when wrong with the server. Handle the trouble here
                    console.log("ZW Error in opening conversation and sending")
                  });
                }
                else if (choiceOfChat == "Audio") {
                  $rootScope.open_form = false;
                  $rootScope.open_audio = true;
                  $rootScope.callType = "Audio Call";
                  $rootScope.submit_success = false;
                  if (rainbowSDK.webRTC.canMakeAudioVideoCall()) {
                    console.log("before call");
                    rainbowSDK.webRTC.callInAudio(selectedContact);
                    console.log("after call");
                  } else {
                    console.log("DEMO :: Your browser can't make audio and video call!");
                    console.log("after ur browser cannot call");
                  };
                }
                else {
                  $rootScope.open_form = false;
                  $rootScope.open_video = true;
                  $rootScope.callType = "Video Call";
                  $rootScope.submit_success = false;
                  if (rainbowSDK.webRTC.canMakeAudioVideoCall()) {
                    rainbowSDK.webRTC.callInVideo(selectedContact);
                  } else {
                    console.log("DEMO :: Your browser can't make audio and video call!");
                  };
                }
              }
              //---------------------------------------------------------------------    
              
              // if no jid -> means not ready and on queue. So we do circular post ddos style

              else if (result.data.queueStatus === "enqueued" || result.data.jid === null) {
                console.log("this is the queue status" + result.data.queueStatus);
                console.log("this is the queue jid" + result.data.jid);
                // while(result.data.queueStatus == "enqueued"){
                let cassimir = $interval(
                  function () {
                    $http({
                      method: 'POST',
                      // url: 'http://localhost:3000/routing/checkQueueStatus/',
                      url: 'https://poc-open-rainbow-swaggy.herokuapp.com/routing/checkQueueStatus',
                      dataType: 'json',
                      data:
                      {
                        name: $scope.user.name,
                        email: $rootScope.user.email,
                        department: $rootScope.user.department,
                        communication: $rootScope.user.communication,
                        problem: $scope.user.problem,
                        queueNumber: queueNumber
                      },
                      headers: { "Content-Type": "application/json" }
                    }).then(async function (result) {
                      if (result.data.queueStatus == "ready" && result.data.jid != null) {
                        let newjid = result.data.jid;
                        $scope.contactJID = result.data.jid;
                        let selectedContactRetry = await rainbowSDK.contacts.searchByJid(newjid);
                        $scope.queueInFront = "It's You're Turn!"
                        console.log("this is queue status " + $scope.queueInFront);
                        $rootScope.csaName = selectedContact.firstname;
                        console.log($rootScope.csaName + "this is csa name");
                        if (choiceOfChat == "Chat") {
                          rainbowSDK.conversations.openConversationForContact(selectedContactRetry).then(function (conversation1) {
                            $rootScope.open_form = false;
                            $rootScope.open_chat = true;

                            console.log("zzzzzz");
                            console.log(conversation1);
                            console.log(conversation1.id);

                            $rootScope.convoID_global = conversation1.id;

                            rainbowSDK.im.sendMessageToConversation(conversation1, $scope.user.problem);

                          }).catch(function (err) {
                            //Something when wrong with the server. Handle the trouble here
                            console.log("ZW Error in opening conversation and sending")
                          });
                        }
                        else if (choiceOfChat == "Audio") {
                          $rootScope.open_audio = true;
                          $rootScope.callType = "Audio Call";
                          if (rainbowSDK.webRTC.canMakeAudioVideoCall()) {
                            console.log("before call");
                            rainbowSDK.webRTC.callInAudio(selectedContact);
                            console.log("after call");
                          } else {
                            console.log("DEMO :: Your browser can't make audio and video call!");
                            console.log("after ur browser cannot call");
                          };
                          console.log("choose audio");
                        }
                        else {
                          $rootScope.open_video = true;
                          $rootScope.callType = "Audio Call";
                          if (rainbowSDK.webRTC.canMakeAudioVideoCall()) {
                            rainbowSDK.webRTC.callInVideo(selectedContact);
                          } else {
                            console.log("DEMO :: Your browser can't make audio and video call!");
                          };
                        }

                        if (result.data.queueStatus == "ready") {
                          $interval.cancel(cassimir);
                        }

                      }
                      else {
                        $scope.queueInFront = result.data.position;
                        let queueStatus = result.data.queueStatus;
                        console.log("OMG PLS WORK FFS");
                        console.log("Queue Status Update: " + queueStatus);
                        console.log("this is the queue jid" + result.data.jid);
                        console.log("this is the queue position" + result.data.position);
                        // this part is where queue number update happens
                      }
                    });
                  }, 10000);
                }
                // when all csa are offline
                else if (result.data.queueStatus === "botActive"){
                  console.log("in here botActive");
                  let selectedContact = await rainbowSDK.contacts.searchByJid(result.data.jid);
                  console.log(selectedContact);
                  if (choiceOfChat == "Chat") {
                    console.log("in chat choice");
                    rainbowSDK.conversations.openConversationForContact(selectedContact).then(function (conversation) {
                      console.log("zzzzzz");
                      console.log(conversation);
                      console.log("converstation id: " + conversation.id);
                      $rootScope.convoID_global = conversation.id;
  
                      $rootScope.open_form = false;
                      $rootScope.open_chat = true;
                      $rootScope.submit_success = false;
                      rainbowSDK.im.sendMessageToConversation(conversation, $scope.user.problem);
                      console.log("ZW Sent messgage");
  
                    }).catch(function (err) {
                      //Something when wrong with the server. Handle the trouble here
                      console.log("ZW Error in opening conversation and sending")
                    });
                  }
                }
              
              

            // }
              
            }).catch(async function (err) {
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
    }).catch(function (err) {
      console.log("[DEMO] :: Error when getting login credentials", err);
    });

    };

$rootScope.signout = function () {
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