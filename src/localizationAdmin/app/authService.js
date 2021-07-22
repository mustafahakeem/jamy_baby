(function() {
    //'use strict';

    angular
        .module('app')
        .factory('authService', authService);

    authService.$inject = ['$window','jwtHelper'];

    function authService($window, jwtHelper) {

        var service = {
            checkAuth: checkAuth
        };
        return service;

        function checkAuthFromLocalStorage(){
            this.token = null;
            var tokenString = $window.localStorage.getItem('bb_token');

            if(tokenString) this.token = JSON.parse(tokenString);
            return this.token;
        }

        function isAuthenticated(){
            if(!this.token) return false;
            return !jwtHelper.isTokenExpired(this.token.accessToken);
        }

        function isVerified(){
            if(!this.token || !this.token.accessToken) return false;
            // var groupClaim = jwtHelper.decodeToken(this.token.accessToken).group;
            //
            // if(groupClaim == "JamesBasic") return true;
            // if(Array.isArray(groupClaim) && groupClaim.indexOf("JamesBasic") > -1)
            //     return true;

          var groupClaim = this.token.permissionGroups;

          var allowedRoles = ['JamesBasic','BigBoss'];
          if(Array.isArray(groupClaim) && allowedRoles.every(x=> groupClaim.indexOf(x)> -1))
            return true;

            return false;
        }

        function checkAuth() {
            var isValidToken = false;
            var token = checkAuthFromLocalStorage();
            if(token){
                isValidToken = isAuthenticated() && isVerified();
            }
            if(!isValidToken){
                $window.location.href = '/';
            }
        }

    }
})();
    