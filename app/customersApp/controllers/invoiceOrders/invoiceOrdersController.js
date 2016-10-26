'use strict';

define(['app'], function (app) {

    var injectParams = ['$filter', '$window', 'dataInvoiceService'];

    var InvoiceOrdersController = function ($filter, $window, dataService) {
        var vm = this;

        vm.invoices = [];
        vm.filteredInvoices;
        vm.filteredCount;

        //paging
        vm.totalRecords = 0;
        vm.pageSize = 10;
        vm.currentPage = 1;

        init();

        vm.pageChanged = function (page) {
            vm.currentPage = page;
            getInvoices();
        };

        vm.searchTextChanged = function () {
            filterInvoicesProducts(vm.searchText);
        };

        function init() {
            //createWatches();
            getInvoices();
        }

        //function createWatches() {
        //    //Watch searchText value and pass it and the invoice to invoiceProductFilter
        //    //Doing this instead of adding the filter to ng-repeat allows it to only be run once (rather than twice)
        //    //while also accessing the filtered count via vm.filteredCount above

        //    //Better to handle this using ng-change on <input>. See searchTextChanged() function.
        //    $scope.$watch("searchText", function (filterText) {
        //        filterCustomersProducts(filterText);
        //    });
        //}

        function filterInvoicesProducts(filterText) {
            vm.filteredInvoices = $filter("invoiceProductFilter")(vm.invoices, filterText);
            vm.filteredCount = vm.filteredInvoices.length;
        }

        function getInvoices() {
            dataService.getInvoices(vm.currentPage - 1, vm.pageSize)
                .then(function (data) {
                    vm.totalRecords = data.totalRecords;
                    vm.customers = data.results;
                    filterInvoicesProducts('');
                }, function (error) {
                    $window.alert(error.message);
                });
        }
    };

    InvoiceOrdersController.$inject = injectParams;

    app.register.controller('InvoiceOrdersController', InvoiceOrdersController);

});