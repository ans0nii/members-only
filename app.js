require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const path = require("path");
const db = require("./db/queries");

const app = express(); 


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

passport.use(
  new LocalStrategy(
    { usernameField: "email" },  
    async (email, password, done) => {
      try {
        const user = await db.getUserByEmail(email);
        
        if (!user) {
          return done(null, false, { message: "Incorrect email" });
        }
        
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return done(null, false, { message: "Incorrect password" });
        }
        
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.getUserById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

const messageRouter = require("./routes/messageRouter");
app.use("/", messageRouter);

const userRouter = require("./routes/userRouter"); 
app.use("/", userRouter);

app.listen(3000, () => console.log("app listening on port 3000!"));