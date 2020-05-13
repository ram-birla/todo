const router = require("express").Router();
const mongoose = require("mongoose");
const Item = mongoose.model("Item");
const User = mongoose.model("User");

router.get("/", async (req,res) => {
    const items = await Item.find({});
    res.send(items);
});

router.get("/:itemId", async (req,res) => {
    const item = await Item.findOne({_id:req.params.itemId});
    res.send(item);
});

router.get("/:userId", async (req,res) =>{
    const user = await User.findOne({_id: req.params.userId})
    res.send(post);

});

router.post("/:userId", async (req,res) => {
    
    //post.title = req.body.title;
    
    const user = await User.findOne({ _id : req.params.userId});
    //create a comment
    const itm = new Item();
    itm.item = req.body.item;
    itm.user = user._id;
    await itm.save();
    // post.comments.push(comment._id);
    // await post.save();
    res.send(itm);
    
});

router.put("/:itemId", async (req,res)=>{
    const itm = await Item.findByIdAndUpdate({
        _id: req.params.itemId
    },
    req.body,{
        new:true,
        runValidators:true
    });
    res.send(itm)
});

router.delete("/:itemId", async (req,res) =>{
    await Item.findByIdAndRemove({_id:req.params.itemId});
    res.send({message:"Items Deleted Succesfully"})

});

module.exports = router;
