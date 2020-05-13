const router = require("express").Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
// const Item = mongoose.model("Item");
const Item = require("../model/Item");


//get all users
router.get("/", async (req,res) => {
    const users = await User.find({});
    res.send(users);
});

//get one user
router.get("/:userId", async (req,res) => {
    const user = await User.findOne({_id: req.params.userId});
    res.send(user);
});

//post one user
router.post("/", async (req,res) => {
    const usr = new User();
    //post.title = req.body.title;
    // itm.item = req.body.item;
    usr.name = req.body.name;
    usr.email = req.body.email;
    usr.contact = req.body.contact;
    usr.password = req.body.password;

    await usr.save();
    res.send(usr);
    
});


router.put("/:userId", async (req,res)=>{
    const usr = await User.findByIdAndUpdate({
        _id: req.params.userId
    },
    req.body,{
        new:true,
        runValidators:true
    });
    res.send(usr)
});

//delete one user
router.delete("/:userId", async (req,res) =>{
    await User.findByIdAndRemove({_id:req.params.userId});
    res.send({message:"Items Deleted Succesfully"})
});

//items
router.get("/:userId/item", async (req,res) =>{
    // const usr = await User.findOne({_id: req.params.userId})
    const user = await Item.find({user:req.params.userId})
    res.send(user);

});

router.get("/:userId/:itemId", async (req,res) =>{
    const usr = await User.findOne({_id: req.params.userId})
    const itm = await Item.findOne({
        _id:req.params.itemId,
        user : usr
    })
    res.send(itm);

});

router.post("/:userId/item", async (req,res) => {
    
    //post.title = req.body.title;
    console.log(req.params.userId)
    console.log(req.body)
    const user = await User.findOne({ _id : req.params.userId});
    //create a comment
    
    const itm = new Item({
        item: req.body.item,
        date: req.body.date,
        time: req.body.time,
        user: req.params.userId
    });
    // itm.item = req.body.item;
    // itm.user = user._id;
    await itm.save();
    // post.comments.push(comment._id);
    // await post.save();
    res.send(itm);
    
});


router.put("/:userId/:itemId", async (req,res)=>{
    const usr = await User.findOne({ _id : req.params.userId});
    const itm = await Item.findByIdAndUpdate({
        _id: req.params.itemId,
        user: usr
    },
    req.body,{
        new:true,
        runValidators:true
    });
    res.send(itm)
});

router.put("/:userId/:itemId/status", async (req,res)=>{
    const usr = await User.findOne({ _id : req.params.userId});
    const itm = await Item.findByIdAndUpdate({
        _id: req.params.itemId,
        user: usr
    },
    req.body,{
        new:true,
        runValidators:true
    });
    res.send(itm)
});

router.delete("/:userId/:itemId", async (req,res) =>{
    const usr = await User.findOne({ _id : req.params.userId});
    await Item.findByIdAndRemove({
        _id: req.params.itemId,
        user: usr
    });
    res.send({message:"Items Deleted Succesfully"})

});


//authenticate input against database
// User.statics.authenticate = function (email, password, callback) {
//     User.findOne({ email: email })
//       .exec(function (err, user) {
//         if (err) {
//           return callback(err)
//         } else if (!user) {
//           var err = new Error('User not found.');
//           err.status = 401;
//           return callback(err);
//         }
//         bcrypt.compare(password, user.password, function (err, result) {
//           if (result === true) {
//             return callback(null, user);
//           } else {
//             return callback();
//           }
//         })
//       });
//   }

module.exports = router;