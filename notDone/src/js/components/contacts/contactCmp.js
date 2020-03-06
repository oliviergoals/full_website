angular.module('sample').component('rbxContact', {
    bindings: {
        item: '<'
    },
    controller : function(rainbowSDK, $scope) {

		this.$onInit = function () {
			var ctrl = $scope;

			$scope.isConnectedUser = false;

			$scope.createConversation = function() {

				var contactId = "5e3cd9e59f17bb3096c6a0c9";
				var selectedContact =  rainbowSDK.contacts.searchById(contactId);
				$scope.$ctrl.item = selectedContact;
				
				rainbowSDK.conversations.openConversationForContact($scope.$ctrl.item)
				.then(function(conversation) {
					console.log("ZW open after");

				}).catch(function() {
					console.log("ERROR");
				});
			};

			$scope.closeConversation = function() {
				rainbowSDK.conversations.closeConversation($scope.$ctrl.item.conversation).then(function(conversation) {
				}).catch(function() {
					console.log("ERROR");
				});
			}

			if(this.item.id === rainbowSDK.contacts.getConnectedUser().id) {
				console.log("Remove button");
				$scope.isConnectedUser = true;
			}
		}
    },
    templateUrl: './src/js/components/contacts/contactCmp.template.html' 
});