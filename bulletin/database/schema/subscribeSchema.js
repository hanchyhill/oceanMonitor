const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Mixed =Schema.Types.Mixed;

let uniSchema = new Schema({
  uniqueid:{type:String,index:true,unique:true,},
  payload: String,
  endpoint:   {type:String,index:true,unique:true,},
  keys: Mixed,
  opt: Mixed,
  },
  {timestamps: true,}
);

uniSchema.pre('save', isNewSave=function(next){
  if(this.isNew){
    // console.log('is New')
  }
  next();
})

//let Bulletin = new mongoose.model('Bulletin',uniSchema,'bulletins');

mongoose.model('Subscribe',uniSchema,'subscribes');