'use strict';

define(['app'], function (app) {

    var injectParams = ['$http', '$q'];

    var invoicesFactory = function ($http, $q) {
        var serviceBase = '/api/dataservice/',
            factory = {};

        factory.getInvoices = function (pageIndex, pageSize) {
            return getPagedResource('invoices', pageIndex, pageSize);
        };

        factory.getInvoicesSummary = function (pageIndex, pageSize) {
            return getPagedResource('invoicesSummary', pageIndex, pageSize);
        };

        factory.checkUniqueValue = function (id, property, value) {
            if (!id) id = 0;
            return $http.get(serviceBase + 'checkUnique/' + id + '?property=' + property + '&value=' + escape(value)).then(
                function (results) {
                    return results.data.status;
                });
        };

        factory.insertInvoice = function (invoice) {
            return $http.post(serviceBase + 'postInvoice', invoice).then(function (results) {
                invoice.id = results.data.id;
                return results.data;
            });
        };

        factory.newInvoice = function () {
            return $q.when({ id: 0 });
        };

        factory.updateInvoice = function (invoice) {
            return $http.put(serviceBase + 'putInvoice/' + invoice.id, invoice).then(function (status) {
                return status.data;
            });
        };

        factory.deleteInvoice = function (id) {
            return $http.delete(serviceBase + 'deleteInvoice/' + id).then(function (status) {
                return status.data;
            });
        };

        factory.getInvoice = function (id) {
            //then does not unwrap data so must go through .data property
            //success unwraps data automatically (no need to call .data property)
            return $http.get(serviceBase + 'invoiceById/' + id).then(function (results) {
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

    invoicesFactory.$inject = injectParams;

    app.factory('invoicesService', invoicesFactory);

});