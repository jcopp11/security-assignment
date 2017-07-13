(function(){   'use strict';   angular   .module("spa-demo.subjects")
.component('sdBusinessServiceSelector',{      
    templateUrl: businessServiceSelectorTemplateUrl , 
    controller: BusinessServiceController, 
    bindings:{           
      authz: '<'
    },
    require:{ 
      businessServiceAuthz:"^sdBusinessServiceAuthz"
    }

	}).run(function(){
		console.log("BusinessServiceDirective fired..");
	});

	businessServiceSelectorTemplateUrl.$inject=["spa-demo.config.APP_CONFIG"];
	function businessServiceSelectorTemplateUrl(APP_CONFIG){
	   return APP_CONFIG.business_service_selector_html
	}


	BusinessServiceController.$inject = ["$scope","$q",
                                       "$state","$stateParams",
                                           "spa-demo.authz.Authz",
                                           "spa-demo.subjects.Business",
                                           "spa-demo.subjects.BusinessService",
                                           "spa-demo.subjects.BusinessServiceList"];

	function BusinessServiceController($scope, $q, $state,
		                                 $stateParams, Authz,
		                                Business, BusinessService,BusinessServiceList){

	    var vm=this;
	    vm.create = create;
	    vm.update = update;
	    vm.remove = remove;
	    vm.clear =  clear;


	    vm.$onInit = function(){
	    console.log("BusinessServiceController", $scope);
        $scope.$watch(function(){ Authz.getAuthorizedUserId(); },
        		function(){
        			 if($stateParams.id){
                console.log("stateParams", $stateParams.id);
        			 	reload($stateParams.id);
        			 }else{
        			 	 newResource();
        			 }
        		});
             }
        return;
         
                    
        function newResource(){
          console.log("newResource()");
          vm.item = new BusinessService();
          console.log("vm.businessesServiceAuthz",vm.businessesServiceAuthz);
          vm.businessServiceAuthz.newItem(vm.item);
          return vm.item;
        } 



        function reload(businessId){
             var itemId = businessId ? businessId : vm.item.id;
             console.log("re/loading business", itemId);
             vm.item = Business.get({id:itemId});
             console.log(vm.item);
             vm.service = BusinessServiceList.query({business_id:itemId});
             vm.businessServiceAuthz.newItem(vm.service);
             $q.all([vm.item.$promise, vm.service.$promise]).catch(handleError);
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
          console.log("remove complete", vm.service);          
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