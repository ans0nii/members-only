const db = require("../db/queries");
const bcrypt = require("bcryptjs");

exports.signUpGet = (req, res) => {
  res.render("sign-up");
};

exports.signUpPost = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.insertUser(firstName, lastName, email, hashedPassword);
    res.redirect("/log-in");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating user");
  }
};

exports.logInGet = (req, res) => {
  res.render("log-in");
};

exports.logOutGet = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

exports.joinClubGet = (req, res) => {
  if (!req.user) {
    return res.redirect("/log-in");
  }
  res.render("join-club", { user: req.user });
};

exports.joinClubPost = async (req, res) => {
  if (!req.user) {
    return res.redirect("/log-in");
  }

  try {
    const { passcode } = req.body;
    const SECRET_PASSCODE = "secret123";

    if (passcode === SECRET_PASSCODE) {
      await db.updateUserMembership(req.user.id);
      res.redirect("/");
    } else {
      res.send("Incorrect passcode! <a href='/join-club'>Try again</a>");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error joining club");
  }
};
