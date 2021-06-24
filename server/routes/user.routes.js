import express from "express";
import userCtrl from "../controllers/user.controller";
import authCtrl from "../controllers/auth.controller";

const router = express.Router();

router.route("/api/users").get(userCtrl.list).post(userCtrl.create);

/* 
A route can has multiple handlers that will be executed one by one
*/
router
  .route("/api/users/:userId")
  .get(authCtrl.requireSignin, userCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.remove);

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
/* Add userByID callback triggered by the userId parameter.
Add user data to req.profile 
*/
router.param("userId", userCtrl.userByID);

export default router;
