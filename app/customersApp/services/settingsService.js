'use strict';

define(['app'], function (app) {

    var injectParams = ['$http', '$q'];

    var settingsFactory = function ($http, $q) {
        var serviceBase = '/api/dataservice/',
            factory = {};

        factory.getSettings = function () {
        	var settings = getPagedResource('appSetting');
            return settings && settings.length > 0 ? settings[0] : {};
        };

        function getPagedResource(baseResource, pageIndex, pageSize) {
            var resource = baseResource;
            resource += (arguments.length == 3) ? buildPagingUri(pageIndex, pageSize) : '';
            return $http.get(serviceBase + resource).then(function (response) {
                var data = response.data;
                return {
                    totalRecords: parseInt(response.headers('X-InlineCount')),
                    results: data
                };
            });
        }

        function buildPagingUri(pageIndex, pageSize) {
            var uri = '?$top=' + pageSize + '&$skip=' + (pageIndex * pageSize);
            return uri;
        }

        return factory;
    };

    settingsFactory.$inject = injectParams;

    app.factory('settingsService', settingsFactory);

});