import mongoose from "mongoose"

const Schema=mongoose.Schema
const commentSchema=new Schema({
  text:{type:String,required:true},
  author:{type:Schema.Types.ObjectId,ref:'Profile'}
},{
  timestamps:true
})

const postSchema=new Schema({
  title:{type:String,required:true},
  location:{type:String,required:true},
  content:{type:String,required:true},
  author:{type:Schema.Types.ObjectId,ref:'Profile'},
  recommendations:[],
  comments:[commentSchema],
  public:Boolean,
  likes:{type:Schema.Types.ObjectId,ref:'Profile'}
},{
  timestamps:true
})
const Post=mongoose.model('Post',postSchema)

export {Post}