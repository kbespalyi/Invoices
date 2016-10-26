'use strict';

define(['app'], function (app) {

    var value = {
        useBreeze: false,
        companyName: "",
        tax_based_value: 0.00,
        tax_imported_value: 0.00
    };

    app.value('config', value);

});