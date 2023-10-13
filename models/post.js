import mongoose from "mongoose"

const Schema=mongoose.Schema
const postSchema=new Schema({
  title:{type:String,required:true},
  location:{type:String,required:true},
  content:{type:String,required:true},
  author:{type:Schema.Types.ObjectId,ref:'Profile'},
  recommendations:[],
  comments:[],
  public:Boolean,
  likes:Boolean
},{
  timestamps:true
})
const Post=mongoose.model('Post',postSchema)

export {Post}