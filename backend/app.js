const express = require('express')
const app = express();
const cors = require('cors')
const xss = require('xss-clean')
const sqlSanitizer = require('express-mongo-sanitize')
const rateLimit = require('express-rate-limit')
const authRouter = require('./routes/authRoute')
const blogRouter = require('./routes/blogRoute')
const helmet = require('helmet');


app.use(express.json())
app.use(cors());

app.use(helmet())

// app.use(
//   sqlSanitizer({
//     sanitizeQuery: false,   // ⛔ prevent req.query mutation
//     allowDots: true,
//     replaceWith: "_"
//   })
// );


const limiter = rateLimit({
    max:100,
    windowMs : 60*60*1000,
    message:'too many request!!try again later'
})
app.use('/api/v1',limiter)
// app.use(xss());



app.use("/api/v1/auth",authRouter)

app.use("/api/v1/blogs",blogRouter)



module.exports = app;