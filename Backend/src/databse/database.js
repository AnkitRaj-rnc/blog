const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/blog", {
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("connection is successfull")
}).catch((e)=>{
    console.log("connection not successfull", e)
})