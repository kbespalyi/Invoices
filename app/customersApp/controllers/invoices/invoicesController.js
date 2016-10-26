'use strict';

define(['app'], function (app) {

    var injectParams = ['$location', '$filter', '$window',
                        '$timeout', 'authService', 'dataInvoicesService', 'modalService'];

    var InvoicesController = function ($location, $filter, $window,
        $timeout, authService, dataService, modalService) {

        var vm = this;

        vm.invoices = [];
        vm.filteredInvoices = [];
        vm.filteredCount = 0;
        vm.orderby = 'id';
        vm.reverse = false;
        vm.searchText = null;
        vm.cardAnimationClass = '.card-animation';

        //paging
        vm.totalRecords = 0;
        vm.pageSize = 10;
        vm.currentPage = 1;

        vm.pageChanged = function (page) {
            vm.currentPage = page;
            getInvoices();
        };

        vm.deleteInvoice = function (id) {
            if (!authService.user.isAuthenticated) {
                $location.path(authService.loginPath + $location.$$path);
                return;
            }

            var inv = getInvoiceById(id);

            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Delete invoice',
                headerText: 'Delete invoice #' + inv.id + '?',
                bodyText: 'Are you sure you want to delete this invoice?'
            };

            modalService.showModal({}, modalOptions).then(function (result) {
                if (result === 'ok') {
                    dataService.deleteInvoice(id).then(function () {
                        for (var i = 0; i < vm.invoices.length; i++) {
                            if (vm.invoices[i].id === id) {
                                vm.invoices.splice(i, 1);
                                break;
                            }
                        }
                        filterInvoices(vm.searchText);
                    }, function (error) {
                        $window.alert('Error deleting invoice: ' + error.message);
                    });
                }
            });
        };

        vm.DisplayModeEnum = {
            Card: 0,
            List: 1
        };

        vm.changeDisplayMode = function (displayMode) {
            switch (displayMode) {
                case vm.DisplayModeEnum.Card:
                    vm.listDisplayModeEnabled = false;
                    break;
                case vm.DisplayModeEnum.List:
                    vm.listDisplayModeEnabled = true;
                    break;
            }
        };

        vm.navigate = function (url) {
            $location.path(url);
        };

        vm.setOrder = function (orderby) {
            if (orderby === vm.orderby) {
                vm.reverse = !vm.reverse;
            }
            vm.orderby = orderby;
        };

        vm.searchTextChanged = function () {
            filterInvoices(vm.searchText);
        };

        function init() {
            //createWatches();
            getInvoices();
        }

        //function createWatches() {
        //    //Watch searchText value and pass it and the invoices to invoiceFilter
        //    //Doing this instead of adding the filter to ng-repeat allows it to only be run once (rather than twice)
        //    //while also accessing the filtered count via vm.filteredCount above

        //    //Better to handle this using ng-change on <input>. See searchTextChanged() function.
        //    vm.$watch("searchText", function (filterText) {
        //        filterInvoices(filterText);
        //    });
        //}

        function getInvoices() {
            dataService.getInvoices(vm.currentPage - 1, vm.pageSize)
            .then(function (data) {
                vm.totalRecords = data.totalRecords;
                vm.invoices = data.results;
                filterInvoices(''); //Trigger initial filter

                $timeout(function () {
                    vm.cardAnimationClass = ''; //Turn off animation since it won't keep up with filtering
                }, 1000);

            }, function (error) {
                $window.alert('Sorry, an error occurred: ' + error.data.message);
            });
        }

        function filterInvoices(filterText) {
            vm.filteredInvoices = $filter("invoiceFilter")(vm.invoices, filterText);
            vm.filteredCount = vm.filteredInvoices.length;
        }

        function getInvoiceById(id) {
            for (var i = 0; i < vm.invoices.length; i++) {
                var inv = vm.invoices[i];
                if (inv.id === id) {
                    return inv;
                }
            }
            return null;
        }

        init();
    };

    InvoicesController.$inject = injectParams;

    app.register.controller('InvoicesController', InvoicesController);

});