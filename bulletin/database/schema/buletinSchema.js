const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Mixed =Schema.Types.Mixed;

let uniSchema = new Schema({
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

uniSchema.index({date:-1});
uniSchema.index({content:"text"});
uniSchema.pre('save', isNewSave=function(next){
  if(this.isNew){
    // console.log('is New')
  }
  next();
})

//let Bulletin = new mongoose.model('Bulletin',uniSchema,'bulletins');

mongoose.model('Bulletin',uniSchema,'bulletins');