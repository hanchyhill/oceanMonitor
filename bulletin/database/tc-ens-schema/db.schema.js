var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cycloneSchema = new Schema({
  cycloneNumber: String,
  cycloneName: String,
  ins: String,
  maxWind: Number,
  basinShort:String,
  basinShort2:String,
  basin:String,
  initTime: {type:Date, index:true,},
  tcID: {type:String, index:true,},
  loc: {type: [],index: '2dsphere'},
  detLoc:{type: [],index: '2dsphere'},
  detIndex:Number,
  controlIndex: Number,
  detTrack:Schema.Types.Mixed,
  fillStatus:Number,//0-null, 1-only det, 2-only ensmble, 3-full,
  tracks:[{
    fcType: String,
    ensembleNumber: Schema.Types.Mixed,
    maxWind: Number,
    track: Array,
  }],
  fileName:String,
},{timestamps: true,}
);
// cycloneSchema.index({initTime:1});
mongoose.model('Cyclone',cycloneSchema,'cyclones');