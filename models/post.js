import mongoose from "mongoose"

const Schema=mongoose.Schema
const commentSchema=new Schema({
  text:{type:String,required:true},
  author:{type:Schema.Types.ObjectId,ref:'Profile'}
},{
  timestamps:true
})
const recommendationSchema=new Schema({
  activityName:{
    type:String,
    required:true,
    enum:['Hiking','Star Gazing','Cycling & Mountain Biking','Whitewater Rafting','Camping'],
  },
  timing:{

    from:{type:Date,required:true},
    to:{type:Date,required:true}
  },
  rating:{
    type:Number,
    min:1,
    max:5,
    default:5,
    required:true
  }
},{
  timestamps:true
})

const postSchema=new Schema({
  title:{type:String,required:true},
  location:{type:String,required:true},
  content:{type:String,required:true},
  author:{type:Schema.Types.ObjectId,ref:'Profile'},
  recommendations:[recommendationSchema],
  comments:[commentSchema],
  public:Boolean,
  likes:[{type:Schema.Types.ObjectId,ref:'Profile'}]
},{
  timestamps:true
})
const Post=mongoose.model('Post',postSchema)

export {Post}