const express = require("express") ;
const mongo = require("./shared")
const blogRouter = require("./routes/blog-routes") ;
const userRouter = require("./routes/user-routes") ;
const cors = require("cors") ;
require('dotenv').config()


const app = express();

mongo.connect()

app.use(cors());

app.use(express.json());

app.use("/api/user", userRouter);

app.use("/api/blog", blogRouter);

app.listen(process.env.PORT||3002, () => {
    console.log(`Server running on port ${3002}`);
  })
