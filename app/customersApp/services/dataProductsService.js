'use strict';

define(['app', 'customersApp/services/productsBreezeService',
        'customersApp/services/productsService'], function (app) {

    var injectParams = ['config', 'productsService', 'productsBreezeService'];

    var dataService = function (config, productsService, productsBreezeService) {
        return (config.useBreeze) ? productsBreezeService : productsService;
    };

    dataService.$inject = injectParams;

    app.factory('dataProductsService',
        ['config', 'productsService', 'productsBreezeService', dataService]);

});

