'use strict';

define(['app'], function (app) {

    var injectParams = ['breeze', '$q', '$window'];

    var invoicesBreezeService = function (breeze, $q, $window) {

        var factory = {};
        var EntityQuery = breeze.EntityQuery;

        // configure to use the model library for Angular
        breeze.config.initializeAdapterInstance('modelLibrary', 'backingStore', true);
        // configure to use camelCase
        breeze.NamingConvention.camelCase.setAsDefault();
        // create entity Manager
        var serviceName = 'breeze/breezedataservice';
        var entityManager = new breeze.EntityManager(serviceName);

        factory.getInvoices = function (pageIndex, pageSize) {
            return getPagedResource('Invoices', 'orders', pageIndex, pageSize);
        };

        factory.getInvoicesSummary = function (pageIndex, pageSize) {
            return getPagedResource('InvoicesSummary', '', pageIndex, pageSize);
        };

        factory.getCustomers = function () {
            return getAll('Customers');
        };

        factory.getProducts = function () {
            return getAll('Products');
        };

        factory.getInvoice = function (id) {
            var query = EntityQuery
                .from('Invoices')
                .where('id', '==', id)
                .expand('Orders, Customers, Products');
            return executeQuery(query, true);
        };

        factory.checkUniqueValue = function (id, property, value) {
            var propertyPredicate = new breeze.Predicate(property, "==", value);
            var predicate = (id) ? propertyPredicate.and(new breeze.Predicate("id", "!=", id)) : propertyPredicate;

            var query = EntityQuery.from('Invoices').where(predicate).take(0).inlineCount();

            return query.using(entityManager).execute().then(function (data) {
                return (data && data.inlineCount == 0) ? true : false;
            });
        };

        factory.insertInvoice = function (invoice) {
            return entityManager.saveChanges();
        };

        factory.newInvoice = function () {
            return getMetadata().then(function () {
                return entityManager.createEntity('Invoice', { dateInvoiced: new Date() });
            });
        };

        factory.deleteInvoice = function (id) {
            if (!id) {
                $window.alert('ID was null - cannot delete');
                return null;
            }
            var invoice = entityManager.getEntityByKey('Invoice', id);

            /*  When the invoice is deleted the invoiceID is set to 0 for each order
                since no parent exists
                Detach orders since the invoice is being deleted and server
                is set to cascade deletes
            */
            if (invoice) {
                var orders = invoice.orders.slice(); //Create a copy of the live list
                orders.forEach(function (order) {
                    entityManager.detachEntity(order);
                });
                invoice.entityAspect.setDeleted();
            }
            else {
                //Really a InvoiceSummary so we're going to add a new Invoice 
                //and mark it as deleted. That allows us to save some code and avoid having
                //a separate method to deal with the InvoiceSummary projection
                invoice = entityManager.createEntity('Invoice', { id: id, dateInvoiced: new Date() }, breeze.EntityState.Deleted);
            }

            return entityManager.saveChanges();
        };

        factory.updateInvoice = function (invoice) {
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

        function getPagedResource(entityName, expand, pageIndex, pageSize) {
            var query = EntityQuery
            .from(entityName)
            .skip(pageIndex * pageSize)
            .take(pageSize)
            .inlineCount(true);

            if (expand && expand != '') {
                query = query.expand(expand);
            }

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

        var OrderCtor = function () {

        };

        function orderInit(order) {

			//TODO retrieve tax percents
            var t_based = 0.00,
            	t_imported = 0.00;
        	
        	order.quantity = order.quantity || 0.00;
        	order.price = order.price || 0.00;
        	
            order.sum = roundToTwo(order.quantity * order.price);
            order.taxes = roundToTwo(order.sum * t_based + order.sum * t_imported);
            order.amount = order.sum + order.taxes;
              
        }

        var InvoiceCtor = function () {

        };

        function invoiceInit(invoice) {
        	var data = ordersTotal(invoice);
            invoice.totalSum = data.totalSum;
            invoice.totalTaxes = data.totalTaxes;
            invoice.totalAmount = data.totalAmount;
        }

        function ordersTotal(invoice) {
            var data = {totalSum: 0.00, totalTaxes: 0.00, totalAmount: 0.00};
            var orders = invoice.orders;
            var count = orders.length;

            for (var i = 0; i < count; i++) {
                data.totalSum += orders[i].sum || 0.00;
                data.totalTaxes += orders[i].taxes || 0.00;
                data.totalAmount += orders[i].amount || 0.00;
            }
            return data;
        };

        entityManager.metadataStore.registerEntityTypeCtor('Order', OrderCtor, orderInit);
        entityManager.metadataStore.registerEntityTypeCtor('Invoice', InvoiceCtor, invoiceInit);

        return factory;
    };

    invoicesBreezeService.$inject = injectParams;

    app.factory('invoicesBreezeService', invoicesBreezeService);

});