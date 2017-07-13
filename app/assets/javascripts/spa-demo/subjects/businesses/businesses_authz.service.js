(function() {
  "use strict";

  angular
    .module("spa-demo.subjects")
    .factory("spa-demo.subjects.BusinessesAuthz", BusinessAuthzFactory);

  BusinessAuthzFactory.$inject = ["spa-demo.authz.Authz",
                                  "spa-demo.authz.BasePolicy"];
  function BusinessAuthzFactory(Authz, BasePolicy) {
    function BusinessAuthz() {
      BasePolicy.call(this, "Business");
    }

      //start with base class prototype definitions
    BusinessAuthz.prototype = Object.create(BasePolicy.prototype);
    BusinessAuthz.constructor = BusinessAuthz;
  
      //override and add additional methods
    BusinessAuthz.prototype.canCreate=function(business) {
      
      return Authz.isMember(business) || Authz.isOrganizer(business) ||  Authz.isAdmin();
    };
     BusinessAuthz.prototype.canUpdate=function(business){
      
     return  Authz.isMember(business) || Authz.isOrganizer(business) ||  Authz.isAdmin();
    };

    BusinessAuthz.prototype.canDelete=function(business) {
     
    return Authz.isMember(business) || Authz.isOrganizer(business) ||  Authz.isAdmin();
    }; 

    return new BusinessAuthz();
  }
})();