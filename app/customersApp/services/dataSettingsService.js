'use strict';

define(['app', 'customersApp/services/settingsBreezeService',
        'customersApp/services/settingsService'], function (app) {

    var injectParams = ['config', 'settingsService', 'settingsBreezeService'];

    var dataService = function (config, settingsService, settingsBreezeService) {
        return (config.useBreeze) ? settingsBreezeService : settingsService;
    };

    dataService.$inject = injectParams;

    app.factory('dataSettingsService',
        ['config', 'settingsService', 'settingsBreezeService', dataService]);

});

