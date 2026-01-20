const db = require("../db/queries");

exports.signUpGet = async(req, res) => {
    res.render("/sign-up");
};


exports.signUpPost = async(req, res) => {
    const {firstName, lastName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.insertUser(firstName, lastName, email, hashedPassword);
    res.redirect("/log-in");
};


exports.logInGet = async(req, res) => {
    res.render("/log-in");
};


exports.logInPost = async(req, res) => {
 const { email, password } = req.body;
 
};


exports.logOutGet = async(req, res);
exports.joinClubGet = async(req, res);
exports.joinClubPost = async(req, res);
