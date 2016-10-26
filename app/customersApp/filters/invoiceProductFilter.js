'use strict';

define(['app'], function (app) {

    var invoiceProductFilter = function () {

        function matchesProduct(invoice, filterValue) {
            if (invoice.orders) {
                for (var i = 0; i < invoice.orders.length; i++) {
                    if (invoice.orders[i].product.toLowerCase().indexOf(filterValue) > -1) {
                        return true;
                    }
                }
            }
            return false;
        }

        return function (invoices, filterValue) {
            if (!filterValue || !invoices) return invoices;

            var matches = [];
            filterValue = filterValue.toLowerCase();
            for (var i = 0; i < invoices.length; i++) {
                var inv = invoices[i];
                if (inv.customer.toLowerCase().indexOf(filterValue) > -1 ||
                    matchesProduct(inv, filterValue)) {

                    matches.push(inv);
                }
            }
            return matches;
        };
    };

    app.filter('invoiceProductFilter', invoiceProductFilter);

});