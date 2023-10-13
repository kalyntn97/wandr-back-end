import { Profile } from "../models/profile.js"
// import { Post } from "../models/post.js" <=import Post model here

async function create(req, res) {
  try {
    req.body.author = req.user.profile
    const post = await Post.create(req.body) // test after Post model is merged
    const profile = await Profile.findByIdAndUpdate(
      req.user.profile,
      { $push: {posts: post}},
      { new: true }
    )
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

async function index(req, res) {
  try {
    const posts = await Post.find({}) // test after Post model is merged
    .populate('author')
    .sort({ createdAt: 'desc' })
    res.status(200).json(posts)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

async function show(req, res) {
  try {
    const post = await Post.findById(req.params.postId) // test after Post model is merged
    // .populate(['author', 'comments.author']) <= a deep kpopulate to populate an embedded resource, AKA author of comments on the post
    res.status(200).json(post)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}


export { 
  create,
  index,
  show,
}