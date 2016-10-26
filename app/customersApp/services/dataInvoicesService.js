'use strict';

define(['app', 'customersApp/services/invoicesBreezeService',
        'customersApp/services/invoicesService'], function (app) {

    var injectParams = ['config', 'invoicesService', 'invoicesBreezeService'];

    var dataService = function (config, invoicesService, invoicesBreezeService) {
        return (config.useBreeze) ? invoicesBreezeService : invoicesService;
    };

    dataService.$inject = injectParams;

    app.factory('dataInvoicesService',
        ['config', 'invoicesService', 'invoicesBreezeService', dataService]);

});

