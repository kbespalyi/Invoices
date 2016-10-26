'use strict';

define(['app'], function (app) {

    var injectParams = ['$http', '$q'];

    var productsFactory = function ($http, $q) {
        var serviceBase = '/api/dataservice/',
            factory = {};

        factory.getProducts = function (pageIndex, pageSize) {
            return getPagedResource('products', pageIndex, pageSize);
        };

        factory.checkUniqueValue = function (id, property, value) {
            if (!id) id = 0;
            return $http.get(serviceBase + 'checkUnique/' + id + '?property=' + property + '&value=' + escape(value)).then(
                function (results) {
                    return results.data.status;
                });
        };

        factory.insertProduct = function (product) {
            return $http.post(serviceBase + 'postProduct', product).then(function (results) {
                product.id = results.data.id;
                return results.data;
            });
        };

        factory.newProduct = function () {
            return $q.when({ id: 0 });
        };

        factory.updateProduct = function (product) {
            return $http.put(serviceBase + 'putProduct/' + product.id, product).then(function (status) {
                return status.data;
            });
        };

        factory.deleteProduct = function (id) {
            return $http.delete(serviceBase + 'deleteProduct/' + id).then(function (status) {
                return status.data;
            });
        };

        factory.getProduct = function (id) {
            //then does not unwrap data so must go through .data property
            //success unwraps data automatically (no need to call .data property)
            return $http.get(serviceBase + 'productById/' + id).then(function (results) {
                return results.data;
            });
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

    productsFactory.$inject = injectParams;

    app.factory('productsService', productsFactory);

});