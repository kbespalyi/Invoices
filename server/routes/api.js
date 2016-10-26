var db = require('../accessDB')
  , util = require('util')
  , formidable = require('formidable')
  , fs = require('fs-extra'); //File System - for file manipulation
  

//CUSTOMERS
// GET
exports.customers = function (req, res) {
    console.log('*** customers');
    var top = req.query.$top;
    var skip = req.query.$skip;

    db.getCustomers(skip, top, function (err, data) {
        res.setHeader('X-InlineCount', data.count);
        if (err) {
            console.log('*** customers err');
            res.json({
                customers: data.customers
            });
        } else {
            console.log('*** customers ok');
            res.json(data.customers);
        }
    });
};

exports.customer = function (req, res) {
    console.log('*** customer');

    db.getCustomer(req.params.id, function (err, customer) {
        if (err) {
            console.log('*** customer err');
            res.json({
                customer: customer
            });
        } else {
            console.log('*** customer ok');
            res.json(customer);
        }
    });
};

exports.addCustomer = function (req, res) {
    console.log('*** addCustomer');
    db.getState(req.body.stateId, function (err, state) {
        if (err) {
            console.log('*** getState err');
            res.json({ 'status': false });
        } else {
            db.insertCustomer(req.body, state, function (err) {
                if (err) {
                    console.log('*** addCustomer err');
                    res.json(false);
                } else {
                    console.log('*** addCustomer ok');
                    res.json(req.body);
                }
            });
        }
    });
};

exports.editCustomer = function (req, res) {
    console.log('*** editCustomer');

    db.getState(req.body.stateId, function (err, state) {
        if (err) {
            console.log('*** getState err');
            res.json({ 'status': false });
        } else {
            db.editCustomer(req.params.id, req.body, state, function (err) {
                if (err) {
                    console.log('*** editCustomer err' + util.inspect(err));
                    res.json({ 'status': false });
                } else {
                    console.log('*** editCustomer ok');
                    res.json({ 'status': true });
                }
            });
        }
    });
};

exports.deleteCustomer = function (req, res) {
    console.log('*** deleteCustomer');

    db.deleteCustomer(req.params.id, function (err) {
        if (err) {
            console.log('*** deleteCustomer err');
            res.json({ 'status': false });
        } else {
            console.log('*** deleteCustomer ok');
            res.json({ 'status': true });
        }
    });
};

// GET
exports.states = function (req, res) {
    console.log('*** states');
    db.getStates(function (err, states) {
        if (err) {
            console.log('*** states err');
            res.json({
                states: states
            });
        } else {
            console.log('*** states ok');
            res.json(states);
        }
    });
};

exports.customersSummary = function (req, res) {
    console.log('*** customersSummary');
    var top = req.query.$top;
    var skip = req.query.$skip;

    db.getCustomersSummary(skip, top, function (err, summary) {
        res.setHeader('X-InlineCount', summary.count);
        if (err) {
            console.log('*** customersSummary err');
            res.json({
                customersSummary: summary.customersSummary
            });
        } else {
            console.log('*** customersSummary ok');
            res.json(summary.customersSummary);
        }
    });
};

// GET
//PRODUCTS
exports.products = function (req, res) {
    console.log('*** products');
    var top = req.query.$top;
    var skip = req.query.$skip;

    db.getProducts(skip, top, function (err, data) {
        res.setHeader('X-InlineCount', data.count);
        if (err) {
            console.log('*** products err');
            res.json({
                products: data.products
            });
        } else {
            console.log('*** products ok');
            res.json(data.products);
        }
    });
};

exports.product = function (req, res) {
    console.log('*** product');

    db.getProduct(req.params.id, function (err, data) {
        if (err) {
            console.log('*** product err');
            res.json({
                product: data
            });
        } else {
            console.log('*** product ok');
            res.json(data);
        }
    });
};

exports.addProduct = function (req, res) {
    console.log('*** addProduct');
    db.insertProduct(req.body, function (err) {
        if (err) {
            console.log('*** addProduct err');
            res.json(false);
        } else {
            console.log('*** addProduct ok');
            res.json(req.body);
        }
    });
};

exports.editProduct = function (req, res) {
    console.log('*** editProduct');

    var files = req.files;
    var objImage = files && files.length > 0 ? files[0] : null;

	//Move the file to ./Content/images/products/ folder
    if (objImage) {

		fs.rename(objImage.path, './Content/images/products/' + objImage.name, function(err) {
			if (err) throw err;
			console.log('renamed complete');
		});
    	
    }

    db.editProduct(req.params.id, req.body, function (err) {
        if (err) {
            console.log('*** editProduct err' + util.inspect(err));
            res.json({ 'status': false });
        } else {
            console.log('*** editProduct ok');
            res.json({ 'status': true });
        }
    });
};

exports.deleteProduct = function (req, res) {
    console.log('*** deleteProduct');

    db.deleteProduct(req.params.id, function (err) {
        if (err) {
            console.log('*** deleteProduct err');
            res.json({ 'status': false });
        } else {
            console.log('*** deleteProduct ok');
            res.json({ 'status': true });
        }
    });
};

//INVOICES
// GET
exports.invoices = function (req, res) {
    console.log('*** invoices');
    var top = req.query.$top;
    var skip = req.query.$skip;

    db.getInvoices(skip, top, function (err, data) {
        res.setHeader('X-InlineCount', data.count);
        if (err) {
            console.log('*** invoices err');
            res.json({
                invoices: data.invoices
            });
        } else {
            console.log('*** invoices ok');
            res.json(data.invoices);
        }
    });
};

exports.invoice = function (req, res) {
    console.log('*** invoice');

    db.getInvoice(req.params.id, function (err, data) {
        if (err) {
            console.log('*** invoice err');
            res.json({
                invoice: data
            });
        } else {
            console.log('*** invoice ok');
            res.json(data);
        }
    });
};

exports.addInvoice = function (req, res) {
    console.log('*** addInvoice');
    db.insertInvoice(req.body, function (err) {
        if (err) {
            console.log('*** addInvoice err');
            res.json(false);
        } else {
            console.log('*** addInvoice ok');
            res.json(req.body);
        }
    });
};

exports.editInvoice = function (req, res) {
    console.log('*** editInvoice');

    db.editInvoice(req.params.id, req.body, function (err) {
        if (err) {
            console.log('*** editInvoice err' + util.inspect(err));
            res.json({ 'status': false });
        } else {
            console.log('*** editInvoice ok');
            res.json({ 'status': true });
        }
    });
};

exports.deleteInvoice = function (req, res) {
    console.log('*** deleteInvoice');

    db.deleteInvoice(req.params.id, function (err) {
        if (err) {
            console.log('*** deleteInvoice err');
            res.json({ 'status': false });
        } else {
            console.log('*** deleteInvoice ok');
            res.json({ 'status': true });
        }
    });
};

exports.invoicesSummary = function (req, res) {
    console.log('*** invoicesSummary');
    var top = req.query.$top;
    var skip = req.query.$skip;

    db.getInvoicesSummary(skip, top, function (err, summary) {
        res.setHeader('X-InlineCount', summary.count);
        if (err) {
            console.log('*** invoicesSummary err');
            res.json({
                invoicesSummary: summary.invoicesSummary
            });
        } else {
            console.log('*** invoicesSummary ok');
            res.json(summary.invoicesSummary);
        }
    });
};

exports.appsetting = function (req, res) {
    console.log('*** appsetting');

    db.getAppsetting(req.params.id, function (err, data) {
        if (err) {
            console.log('*** appsetting err');
            res.json({
                appsetting: data
            });
        } else {
            console.log('*** appsetting ok');
            res.json(data);
        }
    });
};

exports.checkUnique = function (req, res) {
    console.log('*** checkUnique');

    var id = req.params.id,
    	value = req.query.value,
    	property = req.query.property;

    db.checkUnique(id, property, value, function (err, opStatus) {
        if (err) {
            console.log('*** checkUnique err');
            res.json({
                'status': false
            });
        } else {
            console.log('*** checkUnique ok');
            res.json(opStatus);
        }
    });
};

exports.login = function (req, res) {
    console.log('*** login');
    var userLogin = req.body.userLogin;
    var userName = userLogin.userName;
    var password = userLogin.password;

    //Simulate login
    res.json({ status: true });
};

exports.logout = function (req, res) {
    console.log('*** logout');

    //Simulate logout
    res.json({ status: true });
};

exports.upload = function(req, res) {

	var form = new formidable.IncomingForm();
	//Formidable uploads to operating systems tmp dir by default
	form.uploadDir = "./Content/images";
	//set upload directory
	form.keepExtensions = true;
	//keep file extension

	form.parse(req, function(err, fields, files) {
		res.writeHead(200, {
			'content-type' : 'text/plain'
		});
		res.write('received upload:\n\n');
		console.log("form.bytesReceived");
		//TESTING
		console.log("file size: " + JSON.stringify(files.fileUploaded.size));
		console.log("file path: " + JSON.stringify(files.fileUploaded.path));
		console.log("file name: " + JSON.stringify(files.fileUploaded.name));
		console.log("file type: " + JSON.stringify(files.fileUploaded.type));
		console.log("astModifiedDate: " + JSON.stringify(files.fileUploaded.lastModifiedDate));

		//Formidable changes the name of the uploaded file
		//Rename the file to its original name
		fs.rename(files.fileUploaded.path, './Content/images/' + files.fileUploaded.name, function(err) {
			if (err)
				throw err;
			console.log('renamed complete');
		});
		res.end();
	}); 
};

exports.uploadProductImage = function(req, res) {
	var fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
        console.log("Uploading: " + filename);

        //Path where image will be uploaded
        fstream = fs.createWriteStream(__dirname + '/Content/images/products/' + filename);
        file.pipe(fstream);
        fstream.on('close', function () {    
            console.log("Upload Finished of " + filename);              
            res.redirect('back');           //where to go next
        });
    });
};
