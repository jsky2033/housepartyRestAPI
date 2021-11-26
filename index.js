const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");

//constants
dotenv.config();

//initiate express
const app = express();

//initiate mongoose
mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to MongoDB");
  }
);

//middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(cors());

//routes
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const houseRoute = require("./routes/houses");
const postRoute = require("./routes/posts");

//using routes
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/houses", houseRoute);
app.use("/api/posts", postRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});
