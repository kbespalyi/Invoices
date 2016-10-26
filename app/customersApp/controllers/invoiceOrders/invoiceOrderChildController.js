'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope'];

    var InvoiceOrderChildController = function ($scope) {
        var vm = this;

        vm.orderby = 'product';
        vm.reverse = false;
        vm.totalSum = 0.00;
        vm.totalTax = 0.00;
        vm.totalAmount = 0.00;
        vm.invoice;

        init();

        vm.setOrder = function (orderby) {
            if (orderby === vm.orderby) {
                vm.reverse = !vm.reverse;
            }
            vm.orderby = orderby;
        };

        function init() {
            if ($scope.invoice) {
                vm.invoice = $scope.invoice;
                updateTotal($scope.invoice);
            }
            else {
                $scope.$on('invoice', function (event, invoice) {
                    vm.invoice = invoice;
                    updateTotal(invoice);
                });
            }
        }

        function updateTotal(invoice) {
            var totalSum = 0.00, totalTaxes = 0.00, totalAmount = 0.00;
            for (var i = 0; i < invoice.orders.length; i++) {
                var order = invoice.orders[i];
                totalSum += order.totalSum;
                totalTaxes += order.totalTaxes;
                totalAmount += order.totalAmount;
            }
            vm.totalSum = totalSum;
            vm.totalTaxes = totalTaxes;
            vm.totalAmount = totalAmount;
        }
    };

    InvoiceOrderChildController.$inject = injectParams;

    app.controller('InvoiceOrderChildController', InvoiceOrderChildController);
});