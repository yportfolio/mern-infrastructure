import User from "../models/user.model";
import extend from "lodash/extend";
import errorHandler from "./../helpers/dbErrorHandler";
import formidable from "formidable";
import fs from "fs";
import profileImage from "./../../client/assets/images/profile-pic.png";

const create = async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    return res.status(200).json({
      message: "Successfully signed up!",
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

/**
 * Load user and append to req.
 */
const userByID = async (req, res, next, id) => {
  //populate will return array of _id, name of following and follower
  try {
    let user = await User.findById(id)
      .populate("following", "_id name")
      .populate("followers", "_id name")
      .exec();

    if (!user)
      return res.status("400").json({
        error: "User not found",
      });

    req.profile = user;

    next();
  } catch (err) {
    return res.status("400").json({
      error: err,
    });
  }
};

const read = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

const list = async (req, res) => {
  try {
    let users = await User.find().select("name email updated created");
    res.json(users);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const update = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    let user = req.profile;
    user = extend(user, fields);
    user.updated = Date.now();
    if (files.photo) {
      user.photo.data = fs.readFileSync(files.photo.path);
      user.photo.contentType = files.photo.type;
    }
    try {
      await user.save();
      user.hashed_password = undefined;
      user.salt = undefined;
      res.json(user);
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err),
      });
    }
  });
};

const remove = async (req, res) => {
  try {
    let user = req.profile;
    let deletedUser = await user.remove();
    deletedUser.hashed_password = undefined;
    deletedUser.salt = undefined;
    res.json(deletedUser);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

/* 
If found photo, send it in the response to the request. Otherwise, execute next handler function.
 */
const photo = (req, res, next) => {
  if (req.profile.photo.data) {
    res.set("Content-Type", req.profile.photo.contentType);
    return res.send(req.profile.photo.data);
  }
  next();
};

/* 
Send default photo  to the request. 
 */
const defaultPhoto = (req, res) => {
  return res.sendFile(process.cwd() + profileImage);
};

//Finds a matching document, updates it according to the update arg, passing any options,
//and returns the found document (if any) to the callback.
//The query executes if callback is passed.
const addFollowing = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.body.userId, {
      $push: { following: req.body.followId },
    });
    next();
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const addFollower = async (req, res) => {
  try {
    let result = await User.findByIdAndUpdate(
      req.body.followId,
      { $push: { followers: req.body.userId } },
      { new: true }
    )
      .populate("following", "_id name")
      .populate("followers", "_id name")
      .exec();
    result.hashed_password = undefined;
    result.salt = undefined;
    res.json(result);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const removeFollowing = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.body.userId, {
      $pull: { following: req.body.unfollowId },
    });
    next();
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const removeFollower = async (req, res) => {
  try {
    let result = await User.findByIdAndUpdate(
      req.body.unfollowId,
      { $pull: { followers: req.body.userId } },
      { new: true }
    )
      .populate("following", "_id name")
      .populate("followers", "_id name")
      .exec();
    result.hashed_password = undefined;
    result.salt = undefined;
    res.json(result);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

export default {
  create,
  userByID,
  read,
  list,
  remove,
  update,
  photo,
  defaultPhoto,
  addFollowing,
  addFollower,
  removeFollowing,
  removeFollower,
};
