const express = require('express')
const app = express();
const cors = require('cors')
const authRouter = require('./routes/authRoute')
const blogRouter = require('./routes/blogRoute')


app.use(express.json())

app.use(cors());

app.use("/api/v1",authRouter)

app.use("/api/v1/blogs",blogRouter)



module.exports = app;