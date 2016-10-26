'use strict';

define(['app'], function (app) {

    var injectParams = ['breeze', '$q', '$window'];

    var productsBreezeService = function (breeze, $q, $window) {

        var factory = {};
        var EntityQuery = breeze.EntityQuery;

        // configure to use the model library for Angular
        breeze.config.initializeAdapterInstance('modelLibrary', 'backingStore', true);
        // configure to use camelCase
        breeze.NamingConvention.camelCase.setAsDefault();
        // create entity Manager
        var serviceName = 'breeze/breezedataservice';
        var entityManager = new breeze.EntityManager(serviceName);

        factory.getProducts = function (pageIndex, pageSize) {
            return getPagedResource('Products', pageIndex, pageSize);
        };

        factory.getProduct = function (id) {
            var query = EntityQuery
                .from('Products')
                .where('id', '==', id);
            return executeQuery(query, true);
        };

        factory.checkUniqueValue = function (id, property, value) {
            var propertyPredicate = new breeze.Predicate(property, "==", value);
            var predicate = (id) ? propertyPredicate.and(new breeze.Predicate("id", "!=", id)) : propertyPredicate;

            var query = EntityQuery.from('Products').where(predicate).take(0).inlineCount();

            return query.using(entityManager).execute().then(function (data) {
                return (data && data.inlineCount == 0) ? true : false;
            });
        };

        factory.insertProduct = function (product) {
            return entityManager.saveChanges();
        };

        factory.newProduct = function () {
            return getMetadata().then(function () {
                return entityManager.createEntity('Product', { product: '' });
            });
        };

        factory.deleteProduct = function (id) {
            if (!id) {
                $window.alert('ID was null - cannot delete');
                return null;
            }
            var product = entityManager.getEntityByKey('Product', id);

            /*  When the product is deleted the productID is set to 0 for each order
                since no parent exists
                Detach orders since the product is being deleted and server
                is set to cascade deletes
            */
            if (product) {
                product.entityAspect.setDeleted();
            }
            else {
                product = entityManager.createEntity('Product', { id: id }, breeze.EntityState.Deleted);
            }

            return entityManager.saveChanges();
        };

        factory.updateProduct = function (product) {
            return entityManager.saveChanges();
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

        function getPagedResource(entityName, pageIndex, pageSize) {
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

        var ProductCtor = function () {

        };

        function productInit(product) {
        	
        }

        entityManager.metadataStore.registerEntityTypeCtor('Product', ProductCtor, productInit);

        return factory;
    };

    productsBreezeService.$inject = injectParams;

    app.factory('productsBreezeService', productsBreezeService);

});