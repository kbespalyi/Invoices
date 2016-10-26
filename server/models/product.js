var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;


var ProductSchema = new Schema({
  product : {
    type : String, required: true, trim: true
  },
  price : {
    type : Number, required: true
  },
  quantity : {
    type : Number, required: true
  },
  tax_based : {
    type : Boolean, required: false, default: false
  },
  tax_imported : {
    type : Boolean, required: false, default: false
  },
  image : {
    type : String, required: false, default: ""
  },
  imageSrc : {
  	type : String, required: false, default: ""
  },
  id : {
    type : Number, required: true, unique: true
  }
});

ProductSchema.index({ id: 1, type: 1 }); // schema level

ProductSchema.pre('save', function(next) {
  var doc = this;
  // Calculate the next id on new Products only.
  if (this.isNew) {
  	
	var Settings = mongoose.model('settings');
	
    Settings.findOneAndUpdate( {"collectionName": "products"}, { $inc: { nextSeqNumber: 1 } }, function (err, settings) {
      if (err) next(err);
      doc.id = settings.nextSeqNumber - 1; // substract 1 because I need the 'current' sequence number, not the next
      next();
    });
  } else {
    next();
  }
});

ProductSchema.virtual('modelType').get(function() {
    return 'Product';
});

exports.ProductSchema = ProductSchema;
module.exports = mongoose.model('Product', ProductSchema);
