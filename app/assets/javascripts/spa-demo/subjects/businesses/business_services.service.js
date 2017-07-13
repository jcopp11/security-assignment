(function(){
	'use strict';
	angular
	.module('spa-demo.subjects')
	.factory('spa-demo.subjects.BusinessService', BusinessService);

	BusinessService.$inject=["$resource", "spa-demo.config.APP_CONFIG"];
	function BusinessService($resource, APP_CONFIG){
      var service = $resource(APP_CONFIG.server_url + "/api/businesses/:business_id/services/:id",
        { business_id: '@business_id', id: '@id' },
          {
             update: { method: "PUT" },
             save:   { method: "POST"}
          }
        );

      return service;
  }


})();