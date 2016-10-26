// Module dependencies
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , Customer = require('./models/customer')
  , State = require('./models/state')
  , Product = require('./models/product')
  , Invoice = require('./models/invoice')
  , Appsetting = require('./models/appsetting')
  , util = require('util')
  , fs = require('fs-extra'); //File System - for file manipulation

// connect to database
module.exports = {
    // Define class variable
    myEventID: null,

    // initialize DB
    startup: function (dbToUse) {
        mongoose.connect(dbToUse);
        // Check connection to mongoDB
        mongoose.connection.on('open', function () {
            console.log('We have connected to mongodb');
        });

    },

    // disconnect from database
    closeDB: function () {
        mongoose.disconnect();
    },

	//CUSTOMERS
    // get all the customers
    getCustomers: function (skip, top, callback) {
        console.log('*** accessDB.getCustomers');
        var count = 0;
        Customer.find({}, { '_id': 0, 'firstName': 1, 'lastName': 1, 'city': 1, 'state': 1, 'stateId': 1, 'orders': 1, 'orderCount': 1, 'gender': 1, 'id': 1 },
            function (err, customers) {
                count = customers.length;
            })
        .skip(skip)
        .limit(top)
        .exec(function (err, customers) {
            callback(null, {
                count: count,
                customers: customers
            });
        });
    },

    // get the customer summary
    getCustomersSummary: function (skip, top, callback) {
        console.log('*** accessDB.getCustomersSummary');
        var count = 0;
        Customer.find({}, { '_id': 0, 'firstName': 1, 'lastName': 1, 'city': 1, 'state': 1, 'stateId': 1, 'orders': 1, 'orderCount': 1, 'gender': 1, 'id': 1 },
            function (err, customersSummary) {
                count = customersSummary.length;
            })
      .skip(skip)
      .limit(top)
      .exec(function (err, customersSummary) {
          callback(null, {
              count: count,
              customersSummary: customersSummary
          });
      });
    },

    // get a  customer
    getCustomer: function (id, callback) {
        console.log('*** accessDB.getCustomer');
        Customer.find({ 'id': id }, {}, function (err, customer) {
            callback(null, customer[0]);
        });
    },

    // insert a  customer
    insertCustomer: function (req_body, state, callback) {
        console.log('*** accessDB.insertCustomer');

        var customer = new Customer();
        var s = { 'id': state[0].id, 'abbreviation': state[0].abbreviation, 'name': state[0].name };

        customer.firstName = req_body.firstName;
        customer.lastName = req_body.lastName;
        customer.email = req_body.email;
        customer.address = req_body.address;
        customer.city = req_body.city;
        customer.state = s;
        customer.stateId = state[0].id;
        customer.zip = req_body.zip;
        customer.gender = req_body.gender;
        customer.id = 1; // The id is calculated by the Mongoose pre 'save'.

        customer.save(function (err, customer) {
            if (err) { console.log('*** new customer save err: ' + err); return callback(err); }

            callback(null, customer.id);
        });
    },

    editCustomer: function (id, req_body, state, callback) {
        console.log('*** accessDB.editCustomer');

        var s = { 'id': state[0].id, 'abbreviation': state[0].abbreviation, 'name': state[0].name };

        Customer.findOne({ 'id': id }, { '_id': 1, 'firstName': 1, 'lastName': 1, 'city': 1, 'state': 1, 'stateId': 1, 'gender': 1, 'id': 1 }, function (err, customer) {
            if (err) { return callback(err); }

            customer.firstName = req_body.firstName || customer.firstName;
            customer.lastName = req_body.lastName || customer.lastName;
            customer.email = req_body.email || customer.email;
            customer.address = req_body.address || customer.address;
            customer.city = req_body.city || customer.city;
            customer.state = s;
            customer.stateId = s.id;
            customer.zip = req_body.zip || customer.zip;
            customer.gender = req_body.gender || customer.gender;


            customer.save(function (err) {
                if (err) { console.log('*** accessDB.editCustomer err: ' + err); return callback(err); }

                callback(null);
            });

        });
    },

    // delete a customer
    deleteCustomer: function (id, callback) {
        console.log('*** accessDB.deleteCustomer');
        Customer.remove({ 'id': id }, function (err, customer) {
            callback(null);
        });
    },

	//PRODUCTS
    // get all the products
    getProducts: function (skip, top, callback) {
        console.log('*** accessDB.getProducts');
        var count = 0;
        Product.find({}, { '_id': 0, 'product': 1, 'price': 1, 'quantity': 1, 'tax_based': 1, 'tax_imported': 1, 'image': 1, 'imageSrc': 1, 'id': 1 },
            function (err, data) {
                count = data.length;
            })
        .skip(skip)
        .limit(top)
        .exec(function (err, data) {
            callback(null, {
                count: count,
                products: data
            });
        });
    },

    // get a product
    getProduct: function (id, callback) {
        console.log('*** accessDB.getProduct');
        Product.findOne({ 'id': id }, function (err, data) {
            callback(null, data);
        });
    },

    // insert a product
    insertProduct: function (req_body, callback) {
        console.log('*** accessDB.insertProduct');

        var product = new Product();

        product.product = req_body.product || "";
        product.price = req_body.price || 0.00;
        product.quantity = req_body.quantity || 0.00;
        product.tax_based = req_body.tax_based || false;
        product.tax_imported = req_body.tax_imported || false;
        product.image = req_body.image || "";
        product.imageSrc = req_body.imageSrc || "";
        product.id = 1; // The id is calculated by the Mongoose pre 'save'.

        product.save(function (err, product) {
            if (err) { console.log('*** new product save err: ' + err); return callback(err); }

            callback(null, product.id);
        });
    },

	// edit product
    editProduct: function (id, req_body, callback) {
        console.log('*** accessDB.editProduct');
        
		var product = {};
        
        Product.findOne({ 'id': id }, function (err, record) {
            if (err) { console.log('*** accessDB.editProduct err: ' + err); return callback(err); }

			if (req_body.product && req_body.product !== record.product ) {
				product.product = req_body.product;
			}
			if (req_body.price && req_body.price !== record.price ) {
				product.price = req_body.price;
			}
			if (req_body.quantity && req_body.quantity !== record.quantity) {
				product.quantity = req_body.quantity;
			}
			if (req_body.tax_based && req_body.tax_based != record.tax_based) {
				product.tax_based = req_body.tax_based === "true" ? true : false;
			}
			if (req_body.tax_imported && req_body.tax_imported != record.tax_imported) {
				product.tax_imported = req_body.tax_imported === "true" ? true : false;
			}
			if (req_body.image && req_body.image !== record.image) {
				product.image = req_body.image;
				product.imageSrc = req_body.imageSrc;
			}
			
	        Product.findByIdAndUpdate(record._id, {$set: product}, {upsert: false},	function (err, product) {
                if (err) { console.log('*** accessDB.editProduct err: ' + err); return callback(err); }
                callback(null, product);
            });
	        
        });
    },

    // delete a product
    deleteProduct: function (id, callback) {
        console.log('*** accessDB.deleteProduct');
        Product.remove({ 'id': id }, function (err, data) {
            callback(null);
        });
    },

	//INVOICES
    // get all the invoices
    getInvoices: function (skip, top, callback) {
        console.log('*** accessDB.getInvoices');
        var count = 0;
        Invoice.find({}, { '_id': 0, 'customer': 1, 'dateCreated': 1, 'dateModified': 1, 'dateInvoiced': 1, 'totalSum': 1, 'totalTaxes': 1, 'totalAmount': 1, 'orders': 1, 'orderCount': 1, 'id': 1 },
            function (err, data) {
                count = data.length;
            })
        .skip(skip)
        .limit(top)
        .exec(function (err, data) {
            callback(null, {
                count: count,
                invoices: data
            });
        });
    },

    // get the invoice summary
    // TODO add aggregation
    getInvoicesSummary: function (skip, top, callback) {
        console.log('*** accessDB.getInvoicesSummary');
        var count = 0;
        Invoice.find({}, { '_id': 0, 'customer': 1, 'dateCreated': 1, 'dateModified': 1, 'dateInvoiced': 1, 'totalSum': 1, 'totalTaxes': 1, 'totalAmount': 1, 'orders': 1, 'orderCount': 1, 'id': 1 },
            function (err, data) {
                count = data.length;
            })
      .skip(skip)
      .limit(top)
      .exec(function (err, data) {
          callback(null, {
              count: count,
              invoices: data
          });
      });
    },

    // get a invoice
    getInvoice: function (id, callback) {
        console.log('*** accessDB.getProduct');
        Invoice.find({ 'id': id }, {}, function (err, data) {
            callback(null, data[0]);
        });
    },

    // insert a product
    insertInvoice: function (req_body, callback) {
        console.log('*** accessDB.insertInvoice');

        var invoice = new Invoice();

        invoice.customer = req_body.customer;
        invoice.dateCreated = new Date().getTime();
        invoice.dateModified = new Date().getTime();
        invoice.dateInvoiced = req_body.dateInvoiced;
        invoice.totalSum = req_body.totalSum;
        invoice.totalTaxes = req_body.totalTaxes;
        invoice.totalAmount = req_body.totalAmount;
        invoice.orders = req_body.orders;
	    invoice.orderCount = invoice.orders.length;
        invoice.id = 1; // The id is calculated by the Mongoose pre 'save'.

        invoice.save(function (err, invoice) {
            if (err) { console.log('*** new invoice save err: ' + err); return callback(err); }

            callback(null, invoice.id);
        });
    },

	// edit invoice
    editInvoice: function (id, req_body, callback) {
        console.log('*** accessDB.editInvoice');

        Invoice.findOne({ 'id': id }, { '_id': 0, 'customer': 1, 'dateCreated': 1, 'dateModified': 1, 'dateInvoiced': 1, 'totalSum': 1, 'totalTaxes': 1, 'totalAmount': 1, 'orders': 1, 'orderCount': 1, 'id': 1 },
        	function (err, invoice) {
	            if (err) { return callback(err); }
	
		        invoice.customer = req_body.customer || invoice.customer;
		        invoice.dateModified = new Date().getTime();
		        invoice.dateInvoiced = req_body.dateInvoice || invoice.dateInvoiced;
		        invoice.totalSum = req_body.totalSum || invoice.totalSum;
		        invoice.totalTaxes = req_body.totalTaxes || invoice.totalTaxes;
		        invoice.totalAmount = req_body.totalAmount || invoice.totalAmount;
		        invoice.orders = req_body.orders || invoice.orders;
		        invoice.orderCount = invoice.orders.length;
	
	            invoice.save(function (err) {
	                if (err) { console.log('*** accessDB.editInvoice err: ' + err); return callback(err); }
	
	                callback(null);
	            });
        	});
    },

    // delete a invoice
    deleteInvoice: function (id, callback) {
        console.log('*** accessDB.deleteInvoice');
        Invoice.remove({ 'id': id }, function (err, data) {
            callback(null);
        });
    },

    // get all the states
    getStates: function (callback) {
        console.log('*** accessDB.getStates');
        State.find({}, {}, function (err, states) {
            callback(null, states);
        });
    },

    // get a state
    getState: function (stateId, callback) {
        console.log('*** accessDB.getState');
        State.find({ 'id': stateId }, {}, function (err, state) {
            callback(null, state);
        });
    },

	//APPLICATION SETTING
	
    // get the Appsetting
    getAppsetting: function (callback) {
        console.log('*** accessDB.getAppsettings');
        Appsettings.find({}, {}, function (err, data) {
            callback(null, data[0]);
        });
    },

    // check unique id
    checkUnique: function (id, property, value, callback) {
        console.log('*** accessDB.checkUnique');
        console.log(id + ' ' + value);
        switch (property) {
            case 'email':
                Customer.findOne({ 'email': value, 'id': { $ne: id} })
                        .select('email')
                        .exec(function (err, customer) {
                            console.log(customer);
                            var status = (customer) ? false : true;
                            callback(null, {status: status});
                        });
                break;
            case 'product':
                Product.findOne({ 'product': value, 'id': { $ne: id} })
                        .select('product')
                        .exec(function (err, product) {
                            console.log(product);
                            var status = (product) ? false : true;
                            callback(null, {status: status});
                        });
                break;
        }

    },

};
