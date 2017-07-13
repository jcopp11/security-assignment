(function() {
  "use strict";

  angular
    .module("spa-demo.subjects")
    .directive("sdBusinessServiceAuthz", BusinessServiceAuthzDirective);

 BusinessServiceAuthzDirective.$inject = [];

  function BusinessServiceAuthzDirective() {
    var directive = {
        bindToController: true,
        controller: BusinessServiceAuthzController,
        controllerAs: "vm",
        restrict: "A",
        link: link
    };
    return directive;

    function link(scope, element, attrs) {
      console.log("BusinessServiceAuthzDirective", scope);
    }
  }

  BusinessServiceAuthzController.$inject = ["$scope",
                                            "spa-demo.subjects.BusinessServiceAuthz"];
  function BusinessServiceAuthzController($scope, BusinessServiceAuthz) {
    var vm = this;
    vm.authz={};
    vm.authz.canUpdateItem = canUpdateItem;
    vm.newItem=newItem;

    activate();
    return;
    //////////
    function activate() {
      vm.newItem(null);
    }

    function newItem(item) {
     BusinessServiceAuthz.getAuthorizedUser().then(
        function(user){ authzUserItem(item, user); },
        function(user){ authzUserItem(item, user); });
    }

    function authzUserItem(item, user) {
      console.log("new Item/Authz", item, user);

      vm.authz.authenticated = BusinessServiceAuthz.isAuthenticated();
      vm.authz.canQuery      = BusinessServiceAuthz.canQuery();
      vm.authz.canCreate = BusinessServiceAuthz.canCreate();
      if (item && item.$promise) {
        vm.authz.canUpdate     = true;
        vm.authz.canDelete     = false;
        vm.authz.canGetDetails = false;
        item.$promise.then(function(){ checkAccess(item); });
      } else {
        checkAccess(item)
      }
    }

    function checkAccess(item) {
      vm.authz.canUpdate     = BusinessServiceAuthz.canUpdate(item);
      console.log(BusinessServiceAuthz);
      vm.authz.canDelete     = BusinessServiceAuthz.canDelete(item);
      vm.authz.canGetDetails = BusinessServiceAuthz.canGetDetails(item);
      console.log("checkAccess", item, vm.authz);
    }    

    function canUpdateItem(item) {
      return BusinessServiceAuthz.canUpdate(item);
    }    
  }
})();