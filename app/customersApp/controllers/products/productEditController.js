'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope', '$location', '$routeParams',
                        '$timeout', 'config', 'dataProductsService', 'modalService'];

    var ProductEditController = function ($scope, $location, $routeParams,
                                           $timeout, config, dataService, modalService) {

        var vm = this,
            productId = ($routeParams.productId) ? parseInt($routeParams.productId) : 0,
            timer,
            onRouteChangeOff;

        vm.product = {};
        vm.title = (productId > 0) ? 'Edit' : 'Add';
        vm.buttonText = (productId > 0) ? 'Update' : 'Add';
        vm.updateStatus = false;
        vm.errorMessage = '';
        vm.image = {source: "", title: "no image"};

        vm.onFileSelect = function($files) {
			var f = $files[0], //document.getElementById('image').files
			    r = new FileReader();
			r.onloadend = function(e) {
				var data = e.target.result;
				//send you binary data via $http or $resource or do anything else with it
				vm.image = {source: data, title: 'picture'};
			};
			r.readAsBinaryString(f); 
        };

        vm.openDialog = function() {
			uploadcare.openDialog(null, {
			    publicKey: "demopublickey",
			    imagesOnly: true,
			    crop: "free"
			});
        };

        vm.saveProduct = function () {
        	
            if ($scope.editForm.$valid) {
            	
                if (!vm.product.id) {
                    dataService.insertProduct(vm.product).then(processSuccess, processError);
                }
                else {
                    dataService.updateProduct(vm.product).then(processSuccess, processError);
                }
            }
        };

        vm.deleteProduct = function () {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Delete product',
                headerText: 'Delete ' + vm.product.product + '?',
                bodyText: 'Are you sure you want to delete this product?'
            };

            modalService.showModal({}, modalOptions).then(function (result) {
                if (result === 'ok') {
                    dataService.deleteProduct(vm.product.id).then(function () {
                        onRouteChangeOff(); //Stop listening for location changes
                        $location.path('/products');
                    }, processError);
                }
            });
        };
        
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
	                    $location.path('/products');
	                }
	            });
			} else {
	            onRouteChangeOff(); //Stop listening for location changes
	            $location.path('/products');
			}        	

        };

        function init() {

			var widget = uploadcare.Widget('[role=uploadcare-uploader]');
			
			widget.onChange(function(file) {
				if (file) {
					file.done(function(info) {
						// Handle uploaded file info.
						console.log("Upload done");
						
						vm.product.image = info.name;
						vm.product.imageSrc = info.originalUrl;
						
						vm.image = {source: info.originalUrl, title: info.name};
						
			            $scope.editForm.$dirty = true;
			            vm.updateStatus = false;
			            
			            $scope.$apply();
						
					}).fail(function(error, fileInfo) {
						console.log("Upload failed or something else went wrong.");
					});
				};
			});
			
			widget.onUploadComplete(function() {
				console.log("Upload complete");
			}); 

            if (productId > 0) {
                dataService.getProduct(productId).then(function (product) {
                    vm.product = product;
                }, processError);
            } else {
                dataService.newProduct().then(function (product) {
                    vm.product = product;
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
            $location.path('/products');
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

    ProductEditController.$inject = injectParams;

    app.register.controller('ProductEditController', ProductEditController);

});