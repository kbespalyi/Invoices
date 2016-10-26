'use strict';

define(['app'], function (app) {

    var productFilter = function () {

        return function (products, filterValue) {
            if (!filterValue) return products;

            var matches = [];
            filterValue = filterValue.toLowerCase();
            for (var i = 0; i < products.length; i++) {
                var prod = products[i];
                if (prod.product.toLowerCase().indexOf(filterValue) > -1) {
                    matches.push(prod);
                }
            }
            return matches;
        };
    };

    app.filter('productFilter', productFilter);

});