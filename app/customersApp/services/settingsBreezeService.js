'use strict';

define(['app'], function (app) {

    var injectParams = ['breeze', '$q', '$window'];

    var settingsBreezeService = function (breeze, $q, $window) {

        var factory = {};
        var EntityQuery = breeze.EntityQuery;

        // configure to use the model library for Angular
        breeze.config.initializeAdapterInstance('modelLibrary', 'backingStore', true);
        // configure to use camelCase
        breeze.NamingConvention.camelCase.setAsDefault();
        // create entity Manager
        var serviceName = 'breeze/breezedataservice';
        var entityManager = new breeze.EntityManager(serviceName);

        factory.getSettings = function () {
        	var settings = getPagedResource('appSetting');
            return settings && settings.length > 0 ? settings[0] : {};
        };

        function executeQuery(query, takeFirst) {
            return query.using(entityManager).execute().then(querySuccess, queryError);

            function querySuccess(data, status, headers) {
                return takeFirst ? data.results[0] : data.results;
            }

            function queryError(error) {
                $window.alert(error.message);
            }
        }

        function getAll(entityName, expand) {
            var query = EntityQuery.from(entityName);
            if (expand) {
                query = query.expand(expand);
            }
            return executeQuery(query);
        }

        function getMetadata() {
            var store = entityManager.metadataStore;
            if (store.hasMetadataFor(serviceName)) { //Have metadata
                return $q.when(true);
            }
            else { //Get metadata
                return store.fetchMetadata(serviceName);
            }
        }

        function getPagedResource(entityName) {
            var query = EntityQuery
            .from(entityName)
            .skip(pageIndex * pageSize)
            .take(pageSize)
            .inlineCount(true);

            //Not calling the re-useable executeQuery() function here since we need to get to more details
            //and return a custom object
            return query.using(entityManager).execute().then(function (data) {
                return {
                    totalRecords: parseInt(data.inlineCount),
                    results: data.results
                };
            }, function (error) {
                $window.alert('Error ' + error.message);
            });
        }

        return factory;
    };

    settingsBreezeService.$inject = injectParams;

    app.factory('settingsBreezeService', settingsBreezeService);

});