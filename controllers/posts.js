import { Profile } from "../models/profile.js"
// import { Post } from "../models/post.js" <=import Post model here

async function create(req, res) {
  try {
    req.body.author = req.user.profile
    const post = await Post.create(req.body) // <= make sure that this still works when the Model is merged
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


export { 
  create,
}