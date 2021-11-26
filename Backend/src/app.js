const express = require("express")
const port = process.env.PORT || 9000
const app = express()
var nodemailer = require("nodemailer");
require("../src/databse/database")
const Blog = require("../src/models/Blog")

app.use(express.json())
app.use(express.urlencoded({extended:false}))

const smtpTransport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
        user: "@emailId",
        pass: "@emailPassword"
    }
});


// Api to save new blog post with fields (title, description, author)

app.post("/blog", async(req, res)=>{
    try{
        const blog = new Blog(req.body)
        const createBlog = await blog.save()
        res.status(201).send(createBlog)
    }catch(e){
        res.status(500).send(e)
    }
    
    var mailOptions={
        to : req.query.to,
        subject : req.query.subject,
        text : req.query.text
    }
    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function(error, response){
     if(error){
            console.log(error);
        res.end("error");
     }else{
            console.log("Message sent: " + response.message);
        res.end("sent");
         }
});
    
})

// Get all posts.

app.get("/blog", async(req, res)=>{
    try{
        const all_blog = await Blog.find()
        res.status(200).send(all_blog)
    }catch(e){
        res.status(404).send(e)
    }
})

// Get all posts by author id.

app.get("/blog/:id", async(req, res)=>{
    try{
        const _id = req.params.id
        const one_blog = await Blog.findById(_id)
        res.status(200).send(one_blog)
    }catch(e){
        res.status(404).send(e)
    }
})

// Update each post using post id.

app.patch("/blog/:id", async(req, res)=>{
    try{
        const _id = req.params.id
        const update_blog = await Blog.findByIdAndUpdate(_id, req.body, {new:true})
        res.status(201).send(update_blog)
    }catch(e){
        res.status(400).send(e)
    }
})

// Delete post by id.

app.delete("/blog/:id", async(req, res)=>{
    try{
        const _id = req.params.id
        const del_blog = await Blog.findByIdAndDelete(_id)
        res.status(200).send(del_blog)
    }catch(e){
        res.status(404).send(e)
    }
})

app.listen(port, ()=>{
    console.log(`server started at port ${port}`)
})