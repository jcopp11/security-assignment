(function(){
	'use strict';
	angular
	.module("spa-demo")
	.component("sdBusinessServiceEditor",{
       templateUrl: businessServiceEditorTemplateUrl ,
       controller:  BusinessServiceEditorController,
       bindings:{
       	  authz: '<'
       },require:{
            businessServiceAuthz:"^sdBusinessServiceAuthz"
       }
	});


businessServiceEditorTemplateUrl.$inject = ["spa-demo.config.APP_CONFIG"];
function businessServiceEditorTemplateUrl(APP_CONFIG){
	return APP_CONFIG.business_service_editor_html
}


BusinessServiceEditorController.$inject=["$scope","$q","$state","$stateParams",
                                           "spa-demo.authz.Authz",
                                           "spa-demo.subjects.Business",
                                           "spa-demo.subjects.BusinessService",
                                           "spa-demo.subjects.BusinessServiceList"];
function BusinessServiceEditorController($scope,$q,$state, $stateParams,Authz,Business,BusinessService,BusinessServiceList){
    var vm = this;
    vm.create = create;
	  vm.update = update;
	  vm.remove = remove;
	  vm.clear =  clear;

	vm.$onInit = function(){
	console.log("BusinessServiceEditorController", $scope);
	$scope.$watch(function(){ Authz.getAuthorizedUserId(); },
			function(){
				 console.log($stateParams);
				 if($stateParams.id){
	        console.log("stateParams", $stateParams.id);
          vm.bizId = $stateParams.business_id;
          vm.srvId = $stateParams.id
				 	reload(vm.bizId,vm.srvId);
				 }else{
				 	 newResource();
				 }
			});
	       }
 
 return;
         function newResource(){
          console.log("newResource()");
          vm.item = new BusinessServiceList();
          console.log("vm.businessesServiceAuthz",vm.businessesServiceAuthz);
          vm.businessServiceAuthz.newItem(vm.item);
          return vm.item;
        } 



        function reload(businessId,serviceId){
             var itemId = businessId ? businessId : $stateParams.business_id;
             var srvId =  serviceId  ? serviceId  : $stateParams.id; 
             console.log("re/loading business and services",itemId,srvId);
             vm.item = Business.get({id:itemId});
             vm.service = BusinessServiceList.query({business_id:srvId});
             console.log(vm.service);
             vm.businessServiceAuthz.newItem(vm.item);
             $q.all([vm.service.$promise]).catch(handleError);
           }
     
    function clear() {
      newResource();
      $state.go(".", {id: null});
    }

    function create() {
      vm.service.$save().then(
        function(){
           $state.go(".", {id: vm.service.id}); 
        },
        handleError);
    }

    function update() {
      vm.service.errors = null;
      var update=vm.service.$update();
      console.log(vm.service);
      BusinessServiceList(update);
    }


    
      console.log("waiting for promises", promises);
      $q.all(promises).then(
        function(response){
          console.log("promise.all response", response); 
          $scope.serviceEditorform.$setPristine();
          reload(); 
        },
        handleError);    
    

    function remove() {
      vm.service.errors = null;
      vm.service.$delete().then(
        function(){ 
          console.log("remove complete", vm.item);          
          clear();
        },
        handleError);      
    }


	    function handleError(response) {
	      console.log("error", response);
	      if (response.data) {
	        vm.service["errors"]=response.data.errors;          
	      } 
	      if (!vm.service.errors) {
	        vm.service["errors"]={}
	        vm.service["errors"]["full_messages"]=[response]; 
	      }      
	      $scope.serviceEditorform.$setPristine();
	    } 

	}
	})();
