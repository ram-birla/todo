const express = require('express');
const app = express();
require("express-async-errors");
const mongoose = require('mongoose');
require("./mongo");
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require("morgan");
const session = require('express-session');
const User = require("./model/User");
const Item = require("./model/Item");

TWO_HOURS = 1000*60*60*2
const{
    PORT = 3000,
    NODE_ENV = 'development',
    SESS_NAME = 'ram',
    SESS_SECRET = 'ijo20fjfk',
    SESS_LIFETIME = TWO_HOURS
} = process.env

const IN_PROD = NODE_ENV === 'production'
// mongoose.connect('mongodb+srv://test:test@cluster0-pjirh.mongodb.net/test?retryWrites=true&w=majority',{useNewUrlParser:true,useUnifiedTopology:true});
// const db = mongoose.connection;
// db.on('error',console.error.bind(console,'connection error:'));
// db.once('open',function(){
//     console.log("connected to mongodb");
// });

//use sessions for tracking logins
app.use(session({
    name: SESS_NAME,

    secret: SESS_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie :{
        maxAge: SESS_LIFETIME,
        sameSite: true,
        secure: IN_PROD

    }
  }));


//render pages
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({
    extended : true
}))
app.use(bodyParser.json())

const redirectLogin = (req,res,next) =>{
    if(!req.session.userId){
        res.redirect('/login')
    }else{
        next();
    }
}

const redirectHome = (req,res,next) =>{
    if(req.session.userId){
        res.redirect('/index')
    }else{
        next();
    }
}
app.get("/login", redirectHome ,function(req,res){
    msg=""
    res.render("login.ejs",{"msg":msg});
});

app.get("/register", redirectHome , function(req,res){
    var msg =""
    res.render("register.ejs",{'msg':msg});
});

app.post("/login",  async (req,res) =>{
    let {email,password} = req.body;
    console.log(email,password);
    (async()=>{
        try {
        if(email && password){
            console.log("AAAAAAAAAAAA")
            await User.findOne({email: email,password: password}, (err, userData) =>{
            if(err){
                // console.log(userData.password)
                console.log('invalid credential')
                msg = "Invalid Credentials"
                res.render('/login',{"msg":msg})   
                
            } else {
                console.log("bbbbbbbbbbbbbb")
                if(userData == null){
                    msg = "Password Incorrect"
                    res.render('login.ejs',{"msg":msg})
                }else{
                    req.session.user = {
                        email: userData.email,
                        id: userData._id
                    };
                    console.log(userData)

                    req.session.user.expires = new Date(
                        Date.now() + 3 * 24 * 3600 * 1000
                    );
                    console.log('successful login')
                    console.log(req.session)
                    res.redirect('/index')
                }
                    
            }
        })
        // const user = User.find(user=>{
        //     user.email === email && user.password1 === pass
        // }
        // )
        // if(user){
        //     console.log(user.email,user.pass)
        //     req.session.userId = user._id
        //     return res.redirect('/index')
        // }
    }else{
        msg="Invalid Credential"
        res.render('/login',{"msg":msg})
    }
        
    } catch (error) {
        console.log(e)
        msg = "Password Incorrect"
        res.render('/login',{"msg":msg})
    }
})();
    
    
});

app.get('/reset',(req,res)=>{
    res.render("reset.ejs");
})

app.post('/reset', async (req,res)=>{
    let{email,password} = req.body
    user = await User.findOne({email:email})
    user.password = password
    await user.save().then(data=>{
        console.log("Password Changed Successfully")
        console.log(data.user)
        res.redirect('/login')
    }
    )
})
app.post('/register',(req,res) =>{
    (async()=>{
        try{
            let {uname,email,contact,password1} = req.body
            let userData = {
                        name: uname,
                        email,
                        contact,
                        password:password1
                };
            console.log(req.body)
            chkUser = await User.find({email:email}).exec()
            console.log(chkUser)
            if(chkUser.length == 0){
                console.log("save user")
                let user = new User(userData)
                let x = await user.save()
                req.session.user = {
                    email: x.email,
                    id: x._id
                };
                req.session.user.expires = new Date(
                    Date.now() + 3 * 24 * 3600 * 1000
                );
                console.log('successful login')
                console.log(req.session)
                res.redirect('/index')
            }
            else{
                console.log('user already exists')
                msg ="User Already registered"
                res.redirect('/registered',{"msg":msg})
            }
        }
        catch(e){
            console.log(e)
            
        }
    })();
})



app.post('/logout', redirectLogin, function(req,res){
    req.session.destroy(err =>{
        if(err){
            return res.redirect('/home')
        }
        res.clearCookie(SESS_NAME)
        res.redirect('/login')
    })

})


app.get("/index",async (req,res)=>{
    console.log(req.session)
    const user = await User.find({_id :  req.session.user.id})
    console.log(user)
    

    // const item = await Item.find({user:user[0]._id})
    // function(err){
    //     if(err) console.log(err);
    //     else{
    //         // console.log(item)
          
    //         res.render("index.ejs",{"user":user[0],"item":item});
    //     }
    // });
    await Item.find({user:user[0]._id})
    .then(data=>{
        console.log(data)
        res.render("index.ejs",{"user":user[0],"item":data});

    })
});


//routes
// app.use("/items", require("./routes/items"));
app.use("/users", require("./routes/users"));

//errors
app.use((req,res,next) => {
    req.status = 404;
    const error = new Error("Routes not found");
    next(error);
})

//error handler
app.use((error,req,res,next) => {
    res.status(req.status || 500).send({
        message: error.message,
        stack: error.stack
    })
})


//server listening on port 3000
app.listen(3000, function(){
    console.log("server started on port 3000");
});