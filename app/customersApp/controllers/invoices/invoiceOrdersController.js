'use strict';

define(['app'], function (app) {
    
    var injectParams = ['$scope', '$routeParams', '$window', 'dataInvoicesService'];

    var InvoiceOrdersController = function ($scope, $routeParams, $window, dataService) {
        var vm = this,
            invoiceId = ($routeParams.invoiceId) ? parseInt($routeParams.invoiceId) : 0;

        vm.invoice = {};
        vm.totalSum = 0.00;
        vm.totalTaxes = 0.00;
        vm.totalAmount = 0.00;

        init();

        function init() {
            if (invoiceId > 0) {
                dataService.getInvoice(invoiceId)
                .then(function (invoice) {
                    vm.invoice = invoice;
                    $scope.$broadcast('invoice', invoice);
                }, function (error) {
                    $window.alert("Sorry, an error occurred: " + error.message);
                });
            }
        }
    };

    InvoiceOrdersController.$inject = injectParams;

    app.register.controller('InvoiceOrdersController', InvoiceOrdersController);

});