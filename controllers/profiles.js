import { Profile } from '../models/profile.js'
import { User } from '../models/user.js'
import { v2 as cloudinary } from 'cloudinary'
import { Post } from '../models/post.js'

async function index(req, res) {
  try {
    const profiles = await Profile.find({})
    res.json(profiles)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

async function updateProfile(req,res){
  try {
    req.user.profile = req.params.profileId
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        'name': req.body.name,
        'email': req.body.email,
      },
      { new: true }
    )
    const profile = await Profile.findByIdAndUpdate(
      req.params.profileId,
      {'name' : req.body.name,
        'bio': req.body.bio
      },
      {new: true}
    )
    Promise.all([user.save(), profile.save()])
    res.status(200).json(user)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

async function deleteProfile(req, res) {
  try {
    const profile = await Profile.findByIdAndDelete(req.params.profileId)
    const user = await User.findOne({ profile: req.params.profileId })
    if (user) {
      const deleteUser = await User.deleteOne({ _id: user._id })
    }
    res.status(200).json(user)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

async function indexFollowers(req, res) {
  try {
    const profile = await Profile.findById(req.params.profileId)
    const followers = await Profile.find({ _id: { $in: profile.followers } })
    res.status(200).json(followers)
  } catch (error) {
    console.log(error)
  }
}

async function indexFollowing(req, res) {
  try {
    const profile = await Profile.findById(req.params.profileId)
    const following = await Profile.find({ _id: { $in: profile.following } })
    res.status(200).json(following)
  } catch (error) {
    console.log(error)
  }
}

async function addPhoto(req, res) {
  try {
    const imageFile = req.files.photo.path
    const profile = await Profile.findById(req.params.id)

    const image = await cloudinary.uploader.upload(
      imageFile, 
      { tags: `${req.user.email}` }
    )
    profile.photo = image.url
    
    await profile.save()
    res.status(201).json(profile.photo)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

async function show(req, res) {
  try {
    const profile = await Profile.findById(req.params.profileId)
    res.status(200).json(profile)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

async function addFollow(req, res) {
  try {
    const userProfile = await Profile.findById(req.user.profile)
    const otherProfile = await Profile.findById(req.params.profileId)
    userProfile.following.push(otherProfile._id)
    otherProfile.followers.push(userProfile._id)
    Promise.all([userProfile.save(), otherProfile.save()])
    res.status(200).json(otherProfile.followers)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

async function unFollow(req, res) {
  try {
    const userProfile = await Profile.findById(req.user.profile)
    const otherProfile = await Profile.findById(req.params.profileId)
    userProfile.following.remove({_id: otherProfile._id})
    otherProfile.followers.remove({_id: userProfile._id})
    Promise.all([userProfile.save(), otherProfile.save()])
    res.status(200).json(otherProfile.followers)
  } catch (error) {
    console.log(err)
    res.status(500).json(err)
  }
}

async function explorePage(req, res) {
  try {
    const profile = await Profile.findById(req.params.profileId)
    const following = await Profile.find({ _id: { $in: profile.following } })
    const recentPosts = []
    for ( const followedUser of following) {
      const userPosts =  await Post.find({ author: followedUser._id })
        .sort({ createdAt: -1})
        .limit(1)
      if (userPosts.length > 0) {
        recentPosts.push(userPosts[0])
      }
    } 
    res.status(200).json(recentPosts)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

async function deleteSavedPosts(req, res) {
  try {
    const profile = await Profile.findById(req.user.profile)
    const post = await Post.findById(req.params.postId)
    profile.saves.remove({_id: post._id})
    post.saves.remove({_id: profile._id})
    Promise.all([profile.save(), post.save()])
    res.status(200).json(profile.saves)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

export { 
  index,
  addPhoto,
  show,
  addFollow,
  unFollow,
  updateProfile as update,
  indexFollowers,
  indexFollowing,
  explorePage,
  deleteProfile as delete,
  deleteSavedPosts,
}
