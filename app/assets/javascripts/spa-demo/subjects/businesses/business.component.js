(function(){
	'use strict';
	angular
	 .module("spa-demo.subjects")
     .component("sdBusinessSelector", {
       templateUrl: businessSelectorTemplateUrl ,
       controller:  BusinessSelectorController,
       bindings:{
       	  authz: '<'
       }
     })

     .component("sdBusinessEditor",{
         templateUrl: businessEditorTemplateUrl ,
         controller:  BusinessEditorController,
         bindings:{
         	authz: '<'
         },require:{
            businessesAuthz:"^sdBusinessesAuthz"
         }
     });


     businessSelectorTemplateUrl.$inject = ["spa-demo.config.APP_CONFIG"];
     function businessSelectorTemplateUrl(APP_CONFIG){
        return APP_CONFIG.business_selector_html
     }

     businessEditorTemplateUrl.$inject = ["spa-demo.config.APP_CONFIG"];
     function businessEditorTemplateUrl(APP_CONFIG){
     	  return APP_CONFIG.business_editor_html
     }


    
     BusinessSelectorController.$inject = ["$scope", 
                                           "$stateParams",
                                           "spa-demo.authz.Authz",
                                           "spa-demo.subjects.Business"];
     function BusinessSelectorController($scope, $stateParams, Authz, Business){
         var vm=this;
         vm.$onInit = function(){
         	 console.log("BusinessSelectorController", $scope);
         	 $scope.$watch(function(){ return Authz.getAuthorizedUserId(); },
         	  	function(){
                  if(!$stateParams.id){
                  	 vm.items = Business.query();
                  }
         	     });
             }
         return;
     }



     BusinessEditorController.$inject =["$scope","$q",
                                        "$state","$stateParams",
                                        "spa-demo.authz.Authz",
                                        "spa-demo.subjects.Business",
                                        "spa-demo.subjects.BusinessServiceList",
                                        "spa-demo.subjects.BusinessService"];

     function BusinessEditorController($scope, $q, $state, $stateParams,
                                       Authz, Business,
                                       BusinessServiceList,BusinessService){
        var vm=this;
        vm.create = create;
        vm.update = update;
        vm.remove = remove;
        vm.clear =  clear;

        vm.$onInit = function(){
        	console.log("BusinessEditorController", $scope);
        	$scope.$watch(function(){ Authz.getAuthorizedUserId(); },
        		function(){
        			 if($stateParams.id){
                console.log("stateParams", $stateParams.id);
        			 	reload($stateParams.id);
                //vm.items = Business.query();
        			 }else{
        			 	 newResource();
        			 }
        		});
        }
        return;
         
        function newResource(){
          console.log("newResource()");
          vm.item = new Business();
          console.log("vm.businessesAuthz",vm.businessesAuthz);
          vm.businessesAuthz.newItem(vm.item);
          return vm.item;
        } 



        function reload(businessId){
             var itemId = businessId ? businessId : vm.item.id;
             console.log("re/loading business", itemId);
             vm.item = Business.get({id:itemId});
             console.log("vm.item output", vm.item);
             //vm.service = BusinessServiceList.get({business_id: itemId});
             //console.log("services", vm.service);
             vm.businessesAuthz.newItem(vm.item);
             $q.all([vm.item.$promise]).catch(handleError);
        }
     
    function clear() {
      newResource();
      $state.go(".", {id: null});
    }

    function create() {
      vm.item.$save().then(
        function(){
           $state.go(".", {id: vm.item.id}); 
        },
        handleError);
    }
    function update() {
      vm.item.errors = null;
      var update=vm.item.$update();
      Business(update);
    }


      //vm.selected_linkables=[];
      console.log("waiting for promises", promises);
      $q.all(promises).then(
        function(response){
          console.log("promise.all response", response); 
          $scope.businessform.$setPristine();
          reload(); 
        },
        handleError);    
    

    function remove() {
      vm.item.errors = null;
      vm.item.$delete().then(
        function(){ 
          console.log("remove complete", vm.item);          
          clear();
        },
        handleError);      
    }


	    function handleError(response) {
	      console.log("error", response);
	      if (response.data) {
	        vm.item["errors"]=response.data.errors;          
	      } 
	      if (!vm.item.errors) {
	        vm.item["errors"]={}
	        vm.item["errors"]["full_messages"]=[response]; 
	      }      
	      $scope.businessform.$setPristine();
	    }    
     }
})();