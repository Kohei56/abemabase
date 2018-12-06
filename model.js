const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// スキーマ
const abemaSchema = new Schema({
  epTitle: String,
  epDec: String,
  epDetail: String,
  copyright: String,
  production: String,
  year: Number,
  country: String,
  cast: String,
  staff: String,
  rating: String,
  tag: [String],
  videoFileName: String,
  thumFileName: String,
  sceneFileName: [String],
  duration: String,
}, {
  collection: 'test'
});

// MongoDBへの接続
const databaseName = 'abema';
const databasePath = `mongodb://localhost/${databaseName}`;
mongoose.connect(databasePath, {useNewUrlParser: true});

exports.abema = mongoose.model(databaseName, abemaSchema);
