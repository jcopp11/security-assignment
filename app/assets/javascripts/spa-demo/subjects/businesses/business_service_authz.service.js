(function() {
  "use strict";

  angular
    .module("spa-demo.subjects")
    .factory("spa-demo.subjects.BusinessServiceAuthz", BusinessServiceAuthzFactory);

  BusinessServiceAuthzFactory.$inject = ["spa-demo.authz.Authz",
                                  "spa-demo.authz.BasePolicy"];
  function BusinessServiceAuthzFactory(Authz, BasePolicy) {
    function BusinessServiceAuthz() {
      BasePolicy.call(this, "Business");
    }

      //start with base class prototype definitions
    BusinessServiceAuthz.prototype = Object.create(BasePolicy.prototype);
    BusinessServiceAuthz.constructor = BusinessServiceAuthz;
     

      //override and add additional methods
    BusinessServiceAuthz.prototype.canCreate=function(Business) {
      //console.log("ItemsAuthz.canCreate");
      return Authz.isMember(Business) || Authz.isOrganizer(Business) ||  Authz.isAdmin();
    };
     BusinessServiceAuthz.prototype.canUpdate=function(Business){
      //console.log("ItemsAuthz.canCreate");
     return  Authz.isMember(Business) || Authz.isOrganizer(Business) ||  Authz.isAdmin();
    };

    BusinessServiceAuthz.prototype.canDelete=function(Business) {
      //console.log("ItemsAuthz.canCreate");
    return Authz.isMember(Business)   ||  Authz.isOrganizer(Business) ||  Authz.isAdmin();
    }; 
    return new BusinessServiceAuthz();
  }
})();