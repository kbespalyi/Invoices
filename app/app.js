'use strict';

define(['customersApp/services/routeResolver'], function () {

    var app = angular.module('customersApp', ['ngRoute', 'ngAnimate', 'routeResolverServices',
                                              'wc.directives', 'wc.animations', 'ui.bootstrap', 'breeze.angular']);

    app.config(['$routeProvider', 'routeResolverProvider', '$controllerProvider',
                '$compileProvider', '$filterProvider', '$provide', '$httpProvider',

        function ($routeProvider, routeResolverProvider, $controllerProvider,
                  $compileProvider, $filterProvider, $provide, $httpProvider) {

            //Change default views and controllers directory using the following:
            //routeResolverProvider.routeConfig.setBaseDirectories('/app/views', '/app/controllers');

            app.register =
            {
                controller: $controllerProvider.register,
                directive: $compileProvider.directive,
                filter: $filterProvider.register,
                factory: $provide.factory,
                service: $provide.service
            };

            //Define routes - controllers will be loaded dynamically
            var route = routeResolverProvider.route;

            $routeProvider
                //route.resolve() now accepts the convention to use (name of controller & view) as well as the 
                //path where the controller or view lives in the controllers or views folder if it's in a sub folder. 
                //For example, the controllers for customers live in controllers/customers and the views are in views/customers.
                //The controllers for orders live in controllers/orders and the views are in views/orders
                //The second parameter allows for putting related controllers/views into subfolders to better organize large projects
                //Thanks to Ton Yeung for the idea and contribution
                .when('/customers', route.resolve('Customers', 'customers/', 'vm'))
                .when('/customerorders/:customerId', route.resolve('CustomerOrders', 'customers/', 'vm'))
                .when('/customeredit/:customerId', route.resolve('CustomerEdit', 'customers/', 'vm', true))
                .when('/orders', route.resolve('Orders', 'orders/', 'vm'))

                .when('/products', route.resolve('Products', 'products/', 'vm'))
                .when('/productedit/:productId', route.resolve('ProductEdit', 'products/', 'vm', true))
                .when('/productimage/:productId', route.resolve('ProductImageShow', 'products/', 'vm', true))

                .when('/invoices', route.resolve('Invoices', 'invoices/', 'vm'))
                .when('/invoiceorders/:invoiceId', route.resolve('InvoiceOrders', 'invoices/', 'vm'))
                .when('/invoiceedit/:invoiceId', route.resolve('InvoiceEdit', 'invoices/', 'vm', true))
                .when('/invoiceorders', route.resolve('InvoiceOrders', 'invoiceOrders/', 'vm'))

                .when('/about', route.resolve('About', '', 'vm'))
                .when('/login/:redirect*?', route.resolve('Login', '', 'vm'))
                .otherwise({ redirectTo: '/invoices' });

    }]);

    app.run(['$rootScope', '$location', 'authService',
        function ($rootScope, $location, authService) {
            
            //Client-side security. Server-side framework MUST add it's 
            //own security as well since client-based security is easily hacked
            $rootScope.$on("$routeChangeStart", function (event, next, current) {
                if (next && next.$$route && next.$$route.secure) {
                    if (!authService.user.isAuthenticated) {
                        $rootScope.$evalAsync(function () {
                            authService.redirectToLogin();
                        });
                    }
                }
            });

    }]);
    
    app.run(['$rootScope', 'preloaderService',
    	function ($scope, preloader) {

        // I keep track of the state of the loading images.
        $scope.isLoading = true;
        $scope.isSuccessful = false;
        $scope.percentLoaded = 0;

        // NOTE: "cache" attribute is to prevent images from caching in the browser
        $scope.imageLocations = [
            ( "./Content/images/LogoYellow.png?v=1&cache=" + ( new Date() ).getTime() ),
        ];

        // Preload the images; then, update display when returned.
        preloader.preloadImages( $scope.imageLocations ).then(
            function handleResolve( imageLocations ) {

                // Loading was successful.
                $scope.isLoading = false;
                $scope.isSuccessful = true;

                console.info( "Preload Successful" );

            },
            function handleReject( imageLocation ) {

                // Loading failed on at least one image.
                $scope.isLoading = false;
                $scope.isSuccessful = false;

                console.error( "Image Failed", imageLocation );
                console.info( "Preload Failure" );

            },
            function handleNotify( event ) {

                $scope.percentLoaded = event.percent;

                console.info( "Percent loaded:", event.percent );

            }
        );
        
    }]);
    

    return app;

});

function roundToTwo(num) {    
    return +(Math.round(num + "e+2")  + "e-2");
}
