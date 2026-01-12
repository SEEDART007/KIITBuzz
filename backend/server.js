require('dotenv').config();
const app = require('./app');
const dbConfg = require('./db/dbConfig');



const port = process.env.PORT || 3001

app.listen(port,async()=>{
    await dbConfg(); 
    console.log(`server is listening on port ${port}`)
})
 