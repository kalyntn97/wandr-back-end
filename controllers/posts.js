import { Profile } from "../models/profile.js"
import { Post } from "../models/post.js"
import { v2 as cloudinary } from 'cloudinary'

async function create(req, res) {
  try {
    req.body.author = req.user.profile
    const post = await Post.create(req.body)
    const profile = await Profile.findByIdAndUpdate(
      req.user.profile,
      { $push: { posts: post } },
      { new: true }
    )
    post.author = profile
    res.status(200).json(post)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

async function addMorePhotos(req, res) {
  try {
    const post = await Post.findById(req.params.postId)
    const imageFile = req.files.photo.path
    const image = await cloudinary.uploader.upload(
      imageFile,
      { tags: `${req.params.postId}` }
    )
    req.body.url = image.url
    post.morePhotos.push(req.body)
    await post.save()
    const newPhoto = post.morePhotos[post.morePhotos.length - 1]
    res.status(200).json(newPhoto)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
} 2

async function index(req, res) {
  try {
    const posts = await Post.find({})
      .populate({path: 'author'})
      .sort({ createdAt: 'desc' })
    res.status(200).json(posts)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

async function show(req, res) {
  try {
    const post = await Post.findById(req.params.postId)
    .populate([
      {path: 'author'},
      {path: 'comments.author'}
    ])
    res.status(200).json(post)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

async function update(req, res) {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.postId,
      req.body,
      { new: true }
    ).populate('author')
    res.status(200).json(post)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}
async function deletePost(req, res) {
  try {
    const post = await Post.findByIdAndDelete(req.params.postId)
    const profile = await Profile.findById(req.user.profile)
    profile.posts.remove({ _id: req.params.postId })
    await profile.save()
    res.status(200).json(post)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}
async function createComment(req, res) {
  try {
    req.body.author = req.user.profile
    const post = await Post.findById(req.params.postId)
    post.comments.push(req.body)
    await post.save()
    const newComment = post.comments[post.comments.length - 1]
    const profile = await Profile.findById(req.user.profile)
    newComment.author = profile
    res.status(201).json(newComment)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}
async function updateComment(req, res) {
  try {
    const post = await Post.findById(req.params.postId)
    .populate({path: 'comments.author'})
    const comment = post.comments.id(req.params.commentId)
    comment.text = req.body.text
    await post.save()
    res.status(200).json(comment)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}
async function deleteComment(req, res) {
  try {
    const post = await Post.findById(req.params.postId)
    const comment = post.comments.id(req.params.commentId)
    comment.deleteOne()
    await post.save()
    res.status(200).json(comment)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

async function createRec(req, res) {
  try {
    req.body.author = req.user.profile
    const post = await Post.findById(req.params.postId)
    post.recommendations.push(req.body)
    await post.save()

    const newRec = post.recommendations[post.recommendations.length - 1]
    const profile = await Profile.findById(req.user.profile)
    newRec.author = profile
    res.status(201).json(newRec)
  } catch (error) {
    console.log('❌', error)
    res.status(500).json(error)
  }
}

async function deleteRec(req, res) {
  try {
    const post = await Post.findById(req.params.postId)
    const rec = post.recommendations.id(req.params.recommendationId)
    rec.deleteOne()
    await post.save()
    res.status(200).json(rec)
  } catch (error) {
    console.log('❌', error)
    res.status(500).json(error)
  }
}

async function updateRec(req, res) {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    const rec = post.recommendations.id(req.params.recommendationId);
    if (!rec) {
      return res.status(404).json({ error: 'Recommendation not found' });
    }
    rec.name = req.body.name
    rec.activity = req.body.activity
    rec.time = req.body.time
    rec.rating = req.body.rating
    rec.text = req.body.text
    await post.save();
    res.status(200).json(rec);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

async function likePost(req, res) {
  try {
    const post = await Post.findById(req.params.postId)
    post.likes.push(req.user.profile)
    await post.save()
    res.status(200).json(req.user.profile)
  } catch (error) {
    console.log('❌', error)
    res.status(500).json(error)
  }
}

async function unlikePost(req, res) {
  try {
    const post = await Post.findById(req.params.postId)
    post.likes.remove({ _id: req.user.profile })
    await post.save()
    res.status(200).json(req.user.profile)
  } catch (error) {
    console.log(err)
    res.status(500).json(err)
  }
}

async function savePost(req, res) {
  try {
    const post = await Post.findById(req.params.postId)
    await Profile.findByIdAndUpdate(
      req.user.profile,
      { $push: { saves: post } },
      { new: true }
    )
    post.saves.push(req.user.profile)
    await post.save()
    res.status(200).json(req.user.profile)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

async function unsavePost(req, res) {
  try {
    const post = await Post.findById(req.params.postId)
    const profile = await Profile.findById(req.user.profile)
    post.saves.remove({ _id: req.user.profile })
    profile.saves.remove({ _id: post._id })
    Promise.all([profile.save(), post.save()])
    res.status(200).json(post.saves)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  } a
}

async function deleteMorePhotos(req, res) {
  try {
    const post = await Post.findById(req.params.postId)
    const photo = post.morePhotos.id(req.params.photoId)
    photo.deleteOne()
    await post.save()
    res.status(200).json(photo)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

export {
  create,
  index,
  show,
  update,
  deletePost as delete,
  createComment,
  updateComment,
  deleteComment,
  createRec,
  deleteRec,
  updateRec,
  likePost,
  savePost,
  addMorePhotos,
  deleteMorePhotos,
  unlikePost,
  unsavePost,
}
