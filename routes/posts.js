const router = require("express").Router();
const Post = require("../models/Post");

//create a post
router.post("/:id", async (req, res) => {
  //check if correct user is being updated
  if (req.body.authId === req.params.id || req.body.isAdmin) {
    try {
      const newPost = new Post({
        authId: req.body.authId,
        title: req.body.title,
        description: req.body.description,
        pictureIndex: req.body.pictureIndex,
      });

      const post = await newPost.save();

      res.status(200).json(post);
    } catch (err) {
      res.status(500).json(err.message);
    }
  } else {
    return res.status(403).json("You cannot create a house for another user!");
  }
});

//get house information for user
router.get("/:id", async (req, res) => {
  try {
    //get posts if they exists
    const posts = await Post.find({ authId: req.params.id });

    const filtered_posts = posts.map((item) => {
      return {
        title: item.title,
        description: item.description,
        postId: item._id,
        pictureIndex: item.pictureIndex,
      };
    });

    res.status(200).json(filtered_posts);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

//update post information

//update post
router.put("/:id", async (req, res) => {
  //check if correct user's post is being updated
  if (req.body.authId === req.params.id || req.body.isAdmin) {
    try {
      //update the main post document
      await Post.findOneAndUpdate(
        { _id: req.body.postId },
        {
          $set: {
            title: req.body.title,
            description: req.body.description,
          },
        }
      );
      res.status(200).json("Post has been updated for " + req.params.id);
    } catch (err) {
      console.log(err.message);
      res.status(500).json(err.message);
    }
  } else {
    return res.status(403).json("You can update only your post!");
  }
});

//delete post
router.delete("/:id", async (req, res) => {
  console.log(req.body);
  console.log(req.params.id);
  //check if correct user's post is being updated
  if (req.body.authId === req.params.id || req.body.isAdmin) {
    try {
      //delete the main post document
      await Post.deleteOne({ _id: req.body.postId });
      res.status(200).json("Post has been deleted for " + req.params.id);
    } catch (err) {
      console.log(err.message);
      res.status(500).json(err.message);
    }
  } else {
    return res.status(403).json("You can delete only your post!");
  }
});

module.exports = router;
