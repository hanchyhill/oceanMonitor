// 合并initSchemas 和 connect
const mongoose = require('mongoose');
const {configBL,configTC} = require('./privateConfig/private.dbConfig.js');
const MAX_RECONNECTED = 10;

let connect = (config)=>{
  let maxConnectTimes = 0;
  let link, dbConfig;
  if(process.env.NODE_ENV !== 'production'){
    link = config.localLink;
    dbConfig = config.localConfig;
    mongoose.set('debug', true);
  }else{
    link = config.remoteLink;
    dbConfig = config.remoteConfig;
  }
  return new Promise((resolve,reject)=>{
    if(mongoose.connection.readyState ==1){
      console.log('mongo 已连接');
      resolve('mongo 已连接');
    }

    let db = mongoose.createConnection(link, dbConfig);

    db.on('disconnected',()=>{
      db = mongoose.createConnection(link, dbConfig);
    });

    db.on('error',(err)=>{
      maxConnectTimes++;
      if(maxConnectTimes < MAX_RECONNECTED){
        db = mongoose.createConnection(link, dbConfig);
      }
      else{
        reject(new Error('Max Reconnect, DB breakdown.'));
      }
    });
    db.once('open',()=>{
      console.log('MongoDB Connected successfully!=>' + link);
      resolve(db);
    })
  });
};


const Schema = mongoose.Schema;
const Mixed =Schema.Types.Mixed;

let blSchema = new Schema({
  title:{type:String,index:true,unique:true,},
  content:  {type: [String]},
  name: String,
  cn:   String,
  date: { type: Date, default: Date.now },
  timeStamp: String,
  fulltime: String,
  md5:[String],
  extra: Mixed,
  ins:String,
  },
  {timestamps: true,}
);

blSchema.index({date:-1});
blSchema.index({content:"text"});
blSchema.pre('save', isNewSave=function(next){
  if(this.isNew){
    // console.log('is New')
  }
  next();
});

let srcSchema = new Schema({
  uniqueid:{type:String,index:true,unique:true,},
  payload: String,
  endpoint:   {type:String,index:true,unique:true,required: true},
  keys: Mixed,
  opt: Mixed,
  },
  {timestamps: true,}
);

srcSchema.pre('save', isNewSave=function(next){
  if(this.isNew){
    // console.log('is New')
  }
  next();
});

let cycloneSchema = new Schema({
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

exports.connectBL = async ()=>{
  let db = await connect(configBL);
  db.model('Bulletin',blSchema,'bulletins');
  db.model('Subscribe',srcSchema,'subscribes');
  return db;
};

exports.connectTC = async ()=>{
  let db = await connect(configTC);
  db.model('Cyclone',cycloneSchema,'cyclones');
  return db;
}

