var express = require('express'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    errorhandler = require('errorhandler'),
    csrf = require('csurf'),
    routes = require('./routes'),
    api = require('./routes/api'),
    DB = require('./accessDB'),
    protectJSON = require('./lib/protectJSON'),
  	busboy = require('connect-busboy'), //middleware for form/file upload
  	path = require('path'),     //used for file path
    app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(session({ 
    secret: 'invoice12345', 
    saveUninitialized: true,
    resave: true }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/../'));
app.use(errorhandler());
app.use(protectJSON);
app.use(csrf());
app.use(busboy());
//app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    var csrf = req.csrfToken();
    res.cookie('XSRF-TOKEN', csrf);
    res.locals._csrf = csrf;
    next();
});

process.on('uncaughtException', function (err) {
    if (err) console.log(err, err.stack);
});

//Local Connection 
var conn = 'mongodb://localhost/invoices';
var db = new DB.startup(conn);

// Routes
app.get('/', routes.index);

// JSON API
var baseUrl = '/api/dataservice/';

app.get(baseUrl + 'AppSetting', api.appsetting);

app.get(baseUrl + 'Products', api.products);
app.get(baseUrl + 'Product/:id', api.product);
app.get(baseUrl + 'ProductById/:id', api.product);

app.post(baseUrl + 'PostProduct', api.addProduct);
app.put(baseUrl + 'PutProduct/:id', api.editProduct);
app.delete(baseUrl + 'DeleteProduct/:id', api.deleteProduct);

app.get(baseUrl + 'Customers', api.customers);
app.get(baseUrl + 'Customer/:id', api.customer);
app.get(baseUrl + 'CustomersSummary', api.customersSummary);
app.get(baseUrl + 'CustomerById/:id', api.customer);

app.post(baseUrl + 'PostCustomer', api.addCustomer);
app.put(baseUrl + 'PutCustomer/:id', api.editCustomer);
app.delete(baseUrl + 'DeleteCustomer/:id', api.deleteCustomer);

app.get(baseUrl + 'States', api.states);

app.get(baseUrl + 'Invoices', api.invoices);
app.get(baseUrl + 'Invoice/:id', api.invoice);
app.get(baseUrl + 'InvoiceById/:id', api.invoice);
app.get(baseUrl + 'InvoicesSummary', api.invoicesSummary);

app.post(baseUrl + 'PostInvoice', api.addInvoice);
app.put(baseUrl + 'PutInvoice/:id', api.editInvoice);
app.delete(baseUrl + 'DeleteInvoice/:id', api.deleteInvoice);

app.get(baseUrl + 'CheckUnique/:id', api.checkUnique);

app.post(baseUrl + 'Login', api.login);
app.post(baseUrl + 'Logout', api.logout);

app.post(baseUrl + 'UploadProduct', api.uploadProductImage);
app.post(baseUrl + 'Upload', api.upload);


// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

// Start server

app.listen(3000, function () {
    console.log("Invoice Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
