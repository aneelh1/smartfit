//Import from packages
const express = require("express");
const mongoose = require("mongoose");
const adminRouter = require("./routes/admin");

//Import from other files
const authRouter = require("./routes/auth");
const productRouter = require("./routes/product");
const userRouter = require("./routes/user");

//Init
const PORT = 3000;
const app = express();


const cors = require('cors');
app.use(cors());
// app.use(express.urlencoded({ extended: true }));


//Middleware
app.use(express.json());
app.use(authRouter);
app.use(adminRouter);
app.use(productRouter);
app.use(userRouter);

mongoose.set('strictQuery', false);

//Collection

//Collection
mongoose
  .connect('mongodb://127.0.0.1:27017/smartfit')
  .then(() => {
    console.log("Connection Successful");
  })
  .catch((e) => {
    console.log(e);
  });


// app.get('/',(req,res)=>{
//     res.send('Hello World !!!!!')
// })

app.listen(PORT,()=>{
    console.log(`Server Listening on Port http://localhost:${PORT}`);
})
