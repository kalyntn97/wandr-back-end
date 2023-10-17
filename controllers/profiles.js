import { Mongoose } from 'mongoose'
import { Profile } from '../models/profile.js'
import { User } from '../models/user.js'
import { v2 as cloudinary } from 'cloudinary'

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
    const user = await User.findByIdAndUpdate(
      req.params.profileId,
      req.body,
      { new: true }
    )
    await Profile.findByIdAndUpdate(
      user.profile,
      {'name' : user.name }
    )
    res.status(200).json(user)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
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
    // .populate(['author', 'comments.author'])
    .populate([
      {path: 'followers'},
      {path: 'following'}
    ])
    console.log(profile)
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
    res.status(200).json(otherProfile)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

export { 
  index,
  addPhoto,
  show,
  addFollow,
  updateProfile as update
}
