import mongoose from "mongoose"

const Schema=mongoose.Schema
const commentSchema=new Schema({
  text:{type:String,required:true},
  author:{type:Schema.Types.ObjectId,ref:'Profile'}
},{
  timestamps:true
})

const recommendationSchema=new Schema({
  name: {
    type: String, 
    required: true
  },
  activity:{
    type: String,
    required : true,
    enum :['Hiking','Star Gazing','Cycling & Mountain Biking','Whitewater Rafting','Camping', 'Restaurant', 'Museum', 'Nightlife', 'Shopping', 'Art and Music', 'Family-Friendly', 'Scenic Views'],
  },
  time: {
    type: String,
    enum: ['30 min', '1 hour', 'Several Hours', 'All Day', 'Weekend Trip']
  },
  rating:{
    type:Number,
    min:1,
    max:5,
    default:5,
    required:true
  },
  text: {
    type: String
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