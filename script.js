//create a controller that belongs to aparticular model -> controller responsible to fetching data
var myApp = angular.module("myList",[]);
//myApp is a module
myApp.controller("myListController", function($scope){
    $scope.items = ["enter name", "enter email"];
    $scope.dropdown = ["select chat type","select problem category"]  // you can bind any of the elements that controller is in in the html
    $scope.chat = ["chat", "audio", "video"];
    $scope.problem = ["problem1","problemset2","problemsum3"];
    $scope.wait_message = "";
    $scope.sub_message = "";
    $scope.submit = function() { // @ziwei put the button function here
        $scope.wait_message = "Connecting you to our CSA";
        $scope.sub_message = "number of CSA online: 3, est waiting time: 5min";
    }

    $scope.cancel = function(){
        $scope.items = ["enter name", "enter email"];

    }
    

});