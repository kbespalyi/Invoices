var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var SettingsSchema = new Schema({
  collectionName : {
    type : String, required: true, trim: true, default: 'invoices'
  },
  nextSeqNumber: {
    type: Number, default: 1
  }
});
SettingsSchema.virtual('modelType').get(function() {
    return 'Settings';
});

mongoose.model('settings', SettingsSchema);

var AppSettingSchema = new Schema({
  company : {
    type : String, required: true, trim: true
  },
  tax_based_value : {
    type : Number, required: false, default: 0.00
  },
  tax_imported_value : {
    type :  Number, required: false, default: 0.00
  }
});

AppSettingSchema.virtual('modelType').get(function() {
    return 'AppSetting';
});

exports.AppSettingSchema = AppSettingSchema;
module.exports = mongoose.model('AppSetting', AppSettingSchema);
