import { Profile } from "../models/profile.js"
// import { Blog } from "../models/blog.js" <=import Post model here

async function create(req, res) {
  try {
    
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}


export { 
  create,
}