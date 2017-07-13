(function(){
	'use strict';
	angular
	.module('spa-demo.subjects')
	.factory('spa-demo.subjects.BusinessServiceList', BusinessServiceList);

	BusinessServiceList.$inject=["$resource", "spa-demo.config.APP_CONFIG"];
	function BusinessServiceList($resource, APP_CONFIG){
      var service = $resource(APP_CONFIG.server_url + "/api/businesses/:business_id/services/:id",
      	{  business_id: '@business_id', id: '@id' },
      	  {
      	     update: { method: "PUT"    },
             save:   { method: "POST"   },
             delete: { method: "DELETE" }

      	  }
      	);

      return service;
	}

})();