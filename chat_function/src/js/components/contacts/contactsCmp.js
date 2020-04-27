angular.module("sample").component("rbxContacts", {
  bindings: {
    name: "@"
  },
  controller: function rbcConnectionCtrl(rainbowSDK, $rootScope, $scope) {
    $scope.isConnected = false;

    $scope.nbContacts = 0;

    $scope.contacts = [];

    var listeners = [];

    this.$onInit = function() {
      // Subscribe to XMPP connection change
      listeners.push(
        document.addEventListener(
          rainbowSDK.connection.RAINBOW_ONSTARTED,
          onStarted
        )
      );

      // Subscribe to XMPP connection change
      listeners.push(
        document.addEventListener(
          rainbowSDK.connection.RAINBOW_ONCONNECTIONSTATECHANGED,
          onConnectionStateChangeEvent
        )
      );

      // Subscribe to XMPP connection change
      listeners.push(
        document.addEventListener(
          rainbowSDK.presence.RAINBOW_ONCONTACTPRESENCECHANGED,
          onContactPresenceChangeEvent
        )
      );

      // Subscribe to Contact information change connection changes
      listeners.push(
        document.addEventListener(
          rainbowSDK.contacts.RAINBOW_ONCONTACTINFORMATIONCHANGED,
          onContactInformationChangeEvent
        )
      );

      // Subscribe to XMPP connection change
      listeners.push(
        document.addEventListener(
          rainbowSDK.contacts.RAINBOW_ONCONTACTINFORMATIONCHANGED,
          onContactsInformationChanged
        )
      );
    };

    this.$onDestroy = function() {
      var listener = listeners.pop();
      while (listener) {
        listener();
        listener = listeners.pop();
      }
    };

    var onContactInformationChangeEvent = function onContactInformationChangeEvent(
      event
    ) {
      console.log("DEMO :: Contact information changed to ", event.detail);
    };

    var onContactPresenceChangeEvent = function onContactPresenceChangeEvent(
      event
    ) {
      console.log("DEMO :: presence changed to ", event.detail);
    };

    var countNumberOfContacts = function countNumberOfContacts() {
      $scope.nbContacts = Object.keys($scope.contacts).length;
    };

    var onStarted = async function onReady() {
      $scope.contacts = rainbowSDK.contacts.getAll();


    };

    $scope.sendMessage = function(){
      // ------------------------------------------------------------------------
      console.log("zw clik submit");
      
      var contactId = "5e3cd9e59f17bb3096c6a0c9";
      var contactJId = "4c33fa55637949768b4d2dbc417c69da"; 

      var selectedContact = rainbowSDK.contacts.searchByJid(contactJId);
      console.log("zw try to search");
      rainbowSDK.conversations.openConversationForContact(selectedContact).then(function(conversation) {
        console.log("ZW enter");
   
        console.log("ZW Sent open conver");
        rainbowSDK.im.sendMessageToConversation(conversation, "searchById");
        console.log("ZW Sent messgage");
      
      }).catch(function (err) {
        //Something when wrong with the server. Handle the trouble here
        console.log("ZW Error in opening conversation and sending")
      });
      // ------------------------------------------------------------------------

    }

    var onConnectionStateChangeEvent = function onConnectionStateChangeEvent(
      event
    ) {
      var status = event.detail;
      if (status === rainbowSDK.connection.RAINBOW_CONNECTIONCONNECTED) {
        $scope.isConnected = true;
      } else {
        $scope.isConnected = false;
        $scope.nbContacts = 0;
        $scope.contacts = {};
      }
    };

    var onContactsInformationChanged = function onContactsInformationChanged(
      event
    ) {
      var contact = event.detail;
      if (!(contact.id in $scope.contacts)) {
        $scope.contacts[contact.id] = contact;
        countNumberOfContacts();
      } else {
        // Track changes
      }
    };
  },
  templateUrl: "./src/js/components/contacts/contactsCmp.template.html"
});

