const { Router } = require("express");
const userController = require("../controllers/userController");
const passport = require("passport");
const userRouter = Router();

userRouter.get("/sign-up", userController.signUpGet);
userRouter.post("/sign-up", userController.signUpPost);

userRouter.get("/log-in", userController.logInGet);
userRouter.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in",
  }),
);

userRouter.get("/log-out", userController.logOutGet);

userRouter.get("/join-club", userController.joinClubGet);
userRouter.post("/join-club", userController.joinClubPost);

module.exports = userRouter;
