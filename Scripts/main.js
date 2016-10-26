require.config({
    baseUrl: 'app',
    urlArgs: 'v=1.0'
});

require(
    [
        'customersApp/animations/listAnimations',
        'app',
        'customersApp/directives/wcUnique',
        'customersApp/services/routeResolver',
        'customersApp/services/preloaderService',
        'customersApp/services/config',
        'customersApp/services/settingsService',
        'customersApp/services/settingsBreezeService',
        'customersApp/services/customersBreezeService',
        'customersApp/services/authService',
        'customersApp/services/customersService',
        'customersApp/services/invoicesBreezeService',
        'customersApp/services/invoicesService',
        'customersApp/services/productsBreezeService',
        'customersApp/services/productsService',
        'customersApp/services/dataService',
        'customersApp/services/dataInvoicesService',
        'customersApp/services/dataProductsService',
        'customersApp/services/dataSettingsService',
        'customersApp/services/modalService',
        'customersApp/services/httpInterceptors',
        'customersApp/filters/nameCityStateFilter',
        'customersApp/filters/nameProductFilter',
        'customersApp/filters/productFilter',
        'customersApp/filters/invoiceFilter',
        'customersApp/filters/invoiceProductFilter',
        'customersApp/controllers/navbarController',
        'customersApp/controllers/orders/orderChildController',
        'customersApp/controllers/invoiceOrders/invoiceOrderChildController',
    ],
    function () {
        angular.bootstrap(document, ['customersApp']);
    }
);
