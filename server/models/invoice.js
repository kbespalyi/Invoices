var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;


var OrderSchema = new Schema({
  product : {
    type : Number, required: true
  },
  price : {
    type : Number, default: 0.00
  },
  quantity : {
    type : Number, default: 1
  },
  sum : {
    type : Number, default: 0.00
  },
  taxes : {
    type : Number, default: 0.00
  },
  amount : {
    type : Number, default: 0.00
  }
});

var InvoiceSchema = new Schema({
  customer : {
    type : String, required: true, trim: true
  },
  dateCreated : {
    type : Number, required: true
  },
  dateModified : {
    type : Number, required: true
  },
  dateInvoiced : {
    type : Number, required: true
  },
  totalSum : {
    type : Number, required: true
  },
  totalTaxes : {
    type : Number, required: true
  },
  totalAmount : {
    type : Number, required: true
  },
  id : {
    type : Number, required: true, unique: true
  },
  orderCount : {
    type : Number,
  },
  orders: [OrderSchema],
});

InvoiceSchema.index({ id: 1, type: 1 }); // schema level

InvoiceSchema.pre('save', function(next) {
  var doc = this;
  // Calculate the next id on new Invoice only.
  if (this.isNew) {
  	
	var Settings = mongoose.model('settings');
  	
    Settings.findOneAndUpdate( {"collectionName": "invoices"}, { $inc: { nextSeqNumber: 1 } }, function (err, settings) {
      if (err) next(err);
      doc.id = settings.nextSeqNumber - 1; // substract 1 because I need the 'current' sequence number, not the next
      next();
    });
  } else {
    next();
  }
});

InvoiceSchema.virtual('modelType').get(function() {
    return 'Invoice';
});

exports.InvoiceSchema = InvoiceSchema;
module.exports = mongoose.model('Invoice', InvoiceSchema);
