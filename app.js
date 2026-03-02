import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import messageRouter from "./routes/messageRouter.js";
import userRouter from "./routes/userRouter.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/messages", messageRouter);
app.use("/api/auth", userRouter);

app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});
