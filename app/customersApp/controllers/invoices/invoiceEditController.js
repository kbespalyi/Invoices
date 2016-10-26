'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope', '$location', '$routeParams',
                        '$timeout', 'config', 'dataInvoicesService', 'modalService'];

    var InvoiceEditController = function ($scope, $location, $routeParams,
                                           $timeout, config, dataService, modalService) {

        var vm = this,
            invoiceId = ($routeParams.invoiceId) ? parseInt($routeParams.invoiceId) : 0,
            timer,
            onRouteChangeOff;

        vm.invoice = {};
        vm.title = (invoiceId > 0) ? 'Edit' : 'Add';
        vm.buttonText = (invoiceId > 0) ? 'Update' : 'Add';
        vm.updateStatus = false;
        vm.errorMessage = '';

        vm.saveInvoice = function () {
            if ($scope.editForm.$valid) {
                if (!vm.invoice.id) {
                    dataService.insertInvoice(vm.invoice).then(processSuccess, processError);
                }
                else {
                    dataService.updateInvoice(vm.invoice).then(processSuccess, processError);
                }
            }
        };

        vm.deleteInvoice = function () {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Delete invoice',
                headerText: 'Delete invoice #' + vm.invoice.id + '?',
                bodyText: 'Are you sure you want to delete this invoice?'
            };

            modalService.showModal({}, modalOptions).then(function (result) {
                if (result === 'ok') {
                    dataService.deleteInvoice(vm.invoice.id).then(function () {
                        onRouteChangeOff(); //Stop listening for location changes
                        $location.path('/invoices');
                    }, processError);
                }
            });
        };

        vm.back = function() {
        	
        vm.back = function() {

			if ($scope.editForm.$dirty) {
	            var modalOptions = {
	                closeButtonText: 'Cancel',
	                actionButtonText: 'Ignore Changes',
	                headerText: 'Unsaved Changes',
	                bodyText: 'You have unsaved changes. Leave the page?'
	            };
	        	
	            modalService.showModal({}, modalOptions).then(function (result) {
	                if (result === 'ok') {
	                    onRouteChangeOff(); //Stop listening for location changes
	                    $location.path('/invoices');
	                }
	            });
			} else {
	            onRouteChangeOff(); //Stop listening for location changes
	            $location.path('/invoices');
			}        	

        };

        };

        function init() {

            if (invoiceId > 0) {
                dataService.getInvoice(invoiceId).then(function (invoice) {
                    vm.invoice = invoice;
                }, processError);
            } else {
                dataService.newInvoice().then(function (invoice) {
                    vm.invoice = invoice;
                });
            }

            //Make sure they're warned if they made a change but didn't save it
            //Call to $on returns a "deregistration" function that can be called to
            //remove the listener (see routeChange() for an example of using it)
            onRouteChangeOff = $scope.$on('$locationChangeStart', routeChange);
        }

        init();

        function routeChange(event, newUrl, oldUrl) {
            //Navigate to newUrl if the form isn't dirty
            if (!vm.editForm || !vm.editForm.$dirty) return;

            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ignore Changes',
                headerText: 'Unsaved Changes',
                bodyText: 'You have unsaved changes. Leave the page?'
            };

            modalService.showModal({}, modalOptions).then(function (result) {
                if (result === 'ok') {
                    onRouteChangeOff(); //Stop listening for location changes
                    $location.path($location.url(newUrl).hash()); //Go to page they're interested in
                }
            });

            //prevent navigation by default since we'll handle it
            //once the user selects a dialog option
            event.preventDefault();
            return;
        }

        function processSuccess() {
            $scope.editForm.$dirty = false;
            vm.updateStatus = true;
            onRouteChangeOff(); //Stop listening for location changes
            $location.path('/invoices');
        }

        function processError(error) {
            vm.errorMessage = error.message;
            startTimer();
        }

        function startTimer() {
            timer = $timeout(function () {
                $timeout.cancel(timer);
                vm.errorMessage = '';
                vm.updateStatus = false;
            }, 3000);
        }
    };

    InvoiceEditController.$inject = injectParams;

    app.register.controller('InvoiceEditController', InvoiceEditController);

});