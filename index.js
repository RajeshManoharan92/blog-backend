const express = require("express") ;
const mongo = require("./shared")
const blogRouter = require("./routes/blog-routes") ;
const userRouter = require("./routes/user-routes") ;
const cors = require("cors") ;



const app = express();

mongo.connect()

app.use(cors());

app.use(express.json());

app.use("/api/user", userRouter);

app.use("/api/blog", blogRouter);

app.listen(process.env.PORT || 5000, () => {

console.log("Server running on portal 5000")

})
