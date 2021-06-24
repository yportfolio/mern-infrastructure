/* 
Route order is fucking important!!!
 */
import express from "express";
import userCtrl from "../controllers/user.controller";
import authCtrl from "../controllers/auth.controller";

const router = express.Router();

router.route("/api/users").get(userCtrl.list).post(userCtrl.create);

/* 
If found photo, send it in the response to the request. Otherwise, send default photo instead.
 */
router
  .route("/api/users/photo/:userId")
  .get(userCtrl.photo, userCtrl.defaultPhoto);

/* 
Send default photo  to the request. 
 */
router.route("/api/users/defaultphoto").get(userCtrl.defaultPhoto);

/* 
Add one to following and follower array 
 */
router
  .route("/api/users/follow")
  .put(authCtrl.requireSignin, userCtrl.addFollowing, userCtrl.addFollower);

/* 
Remove one from following and follower array 
 */
router
  .route("/api/users/unfollow")
  .put(
    authCtrl.requireSignin,
    userCtrl.removeFollowing,
    userCtrl.removeFollower
  );

/* 
A route can has multiple handlers that will be executed one by one
*/
router
  .route("/api/users/:userId")
  .get(authCtrl.requireSignin, userCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.remove);

/* Add userByID callback triggered by the userId parameter.
Add user data to req.profile 
*/
router.param("userId", userCtrl.userByID);

export default router;
