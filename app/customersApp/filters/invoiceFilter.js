'use strict';

define(['app'], function (app) {

    var invoiceFilter = function () {

        return function (invoices, filterValue) {
            if (!filterValue) return invoices;

            var matches = [];
            filterValue = filterValue.toLowerCase();
            for (var i = 0; i < invoices.length; i++) {
                var inv = invoice[i];
                if (inv.id == filterValue) {
                    matches.push(inv);
                }
            }
            return matches;
        };
    };

    app.filter('invoiceFilter', invoiceFilter);

});