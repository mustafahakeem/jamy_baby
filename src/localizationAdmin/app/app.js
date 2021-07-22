(function() {
    'use strict';

    var app = angular.module('app', [
        // Angular modules 
        // ngAnimate',
        //'ngRoute',
        'ngSanitize'
        // Custom modules
        ,'environment'

        // 3rd Party Modules    
        , 'angularFileUpload'
        , 'angular-jwt'
    ]);

    // config settings
    app.configuration = {

    };

    app.config(function(envServiceProvider) {
        // set the domains and variables for each environment
        envServiceProvider.config({
            domains: {
                dev: ['localhost'],
                prod: ['james.spenn.com'],
                ci: ['bb-ci-james.azurewebsites.net'],
                uat: ['uat-james.spenn.com'],
                test1: ['bb-test1-james.azurewebsites.net'],
                test2: ['bb-test2-james.azurewebsites.net'],
                test3: ['bb-test3-james.azurewebsites.net'],
                qa: ['bb-qa-james.azurewebsites.net'],
                qa2: ['bb-qa2-james.azurewebsites.net'],
                qa3: ['bb-qa3-james.azurewebsites.net']
            },
            vars: {
                dev: {
                    apiUrl: 'http://localhost/James',
                    blockbondsApi: 'http://localhost/Blockbonds',
                    identityServer: 'http://localhost/IdentityServer'
                },
                prod: {
                    apiUrl: 'https://jamesapi.spenn.com',
                    blockbondsApi: 'https://bb-prod-ase-api.spenninternal.com',
                    identityServer: 'https://bb-prod-ase-idsrv.spenninternal.com'
                },
                ci: {
                    apiUrl: 'https://bb-ci-jamesapi.azurewebsites.net',
                    blockbondsApi: 'https://bb-ci-api.azurewebsites.net',
                    identityServer: 'https://bb-ci-idsrv.azurewebsites.net'
                },
                uat: {
                    apiUrl: 'https://uat-jamesapi.spenn.com',
                    blockbondsApi: 'https://bb-uat-ase-api.spenninternal.com',
                    identityServer: 'https://bb-uat-ase-idsrv.spenninternal.com'
                },
                test1: {
                    apiUrl: 'https://bb-test1-jamesapi.azurewebsites.net',
                    blockbondsApi: 'https://bb-test1-api.azurewebsites.net',
                    identityServer: 'https://bb-test1-idsrv.azurewebsites.net'
                },
                test2: {
                    apiUrl: 'https://bb-test2-jamesapi.azurewebsites.net',
                    blockbondsApi: 'https://bb-test2-api.azurewebsites.net',
                    identityServer: 'https://bb-test2-idsrv.azurewebsites.net'
                },
                test3: {
                  apiUrl: 'https://bb-test3-jamesapi.azurewebsites.net',
                  blockbondsApi: 'https://bb-test3-api.azurewebsites.net',
                  identityServer: 'https://bb-test3-idsrv.azurewebsites.net'
                },
                qa: {
                    apiUrl: 'https://bb-qa-jamesapi.azurewebsites.net',
                    blockbondsApi: 'https://bb-qa-api.azurewebsites.net',
                    identityServer: 'https://bb-qa-idsrv.azurewebsites.net'
                },
                qa2: {
                    apiUrl: 'https://bb-qa2-jamesapi.azurewebsites.net',
                    blockbondsApi: 'https://bb-qa2-api.azurewebsites.net',
                    identityServer: 'https://bb-qa2-idsrv.azurewebsites.net'
                },
                qa3: {
                  apiUrl: 'https://bb-qa3-jamesapi.azurewebsites.net',
                  blockbondsApi: 'https://bb-qa3-api.azurewebsites.net',
                  identityServer: 'https://bb-qa3-idsrv.azurewebsites.net'
                },
                defaults: {
                    apiUrl: 'https://bb-ci-jamesapi.azurewebsites.net',
                    blockbondsApi: 'https://bb-ci-api.azurewebsites.net',
                    identityServer: 'https://bb-ci-idsrv.azurewebsites.net'
                }
            }
        });

        // run the environment check, so the comprobation is made
        // before controllers and services are built
        envServiceProvider.check();
    });

    // app.config(['$httpProvider', function ($httpProvider) {
    //     // $httpProvider.defaults.headers.common['Authorization'] = 'your_token';
    //     $httpProvider.interceptors.push(function($q) {
    //         return {
    //             'request': function(config) {
    //
    //                 config.headers['Authorization'] = 'your_token';
    //                 return config;
    //             }
    //         };
    //     });
    // }]);

    app.factory('BearerAuthInterceptor', function ($window, $q) {
        return {
            request: function(config) {
                // if(config.method == 'POST') {
                    config.headers = config.headers || {};
                    if ($window.localStorage.getItem('bb_token')) {
                        var tokenString = $window.localStorage.getItem('bb_token');
                        var token = JSON.parse(tokenString);

                        config.headers.Authorization = 'Bearer ' + token.accessToken;
                    }
                // }
                return config || $q.when(config);
            },
            response: function(response) {
                if (response.status === 401) {
                    $window.location.href = '/';
                }
                return response || $q.when(response);
            }
        };
    });

// Register the previously created AuthInterceptor.
    app.config(function ($httpProvider) {
        $httpProvider.interceptors.push('BearerAuthInterceptor');
        $httpProvider.defaults.withCredentials = true;
        // $httpProvider.defaults.useXDomain = true;
        // delete $httpProvider.defaults.headers.common['X-Requested-With'];
    });

    app.config([
            function() {
                $("#ListPanel").resizable({
                    handleSelector: ".splitter",
                    resizeHeight: false
                });
            }
        ])
        .filter('linebreakFilter', function() {
            return function(text) {
                if (text !== undefined)
                    return text.replace(/\n/g, '<br />');
                return text;
            };
        });

    app.directive('convertToNumber', function() {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, ngModel) {
                ngModel.$parsers.push(function(val) {
                    return parseInt(val, 10);
                });
                ngModel.$formatters.push(function(val) {
                    return '' + val;
                });
            }
        };
    });

    app.directive('wwRtl', function() {
        return {
            //require: "ngModel",
            restrict: "A",
            replace: true,
            scope: {
                wwRtl: "@"
            },
            link: function($scope, $element, $attrs) {
                var expr = $scope.wwRtl;
                $scope.$parent.$watch(expr, function(isRtl) {
                    var rtl = "";
                    if (isRtl)
                        rtl = "rtl";
                    $element.attr("dir", rtl);
                });
            }
        }
    });
})();
