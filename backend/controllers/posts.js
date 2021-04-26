const Post = require("../models/post");

exports.createPost = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId,
    ingredients: req.body.ingredients,
    stepContent: req.body.stepContent,
    isItPrivate: req.body.isItPrivate
  });
  post
    .save()
    .then((createdPost) => {
      res.status(201).json({
        message: "Post added successfully",
        post: {
          ...createdPost,
          id: createdPost._id,
        },
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Creating a post failed!",
      });
    });
};

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    ingredients: req.body.ingredients,
    stepContent: req.body.stepContent,
    imagePath: imagePath,
    creator: req.userData.userId,
    isItPrivate: req.body.isItPrivate
  });
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({ message: "Update successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Couldn't udpate post!",
      });
    });
};

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;

  postQuery
    .then((documents) => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then((count) => {
      let tempFetchPosts = fetchedPosts.filter(post=>post.creator.toString() == req.params.id)
      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: fetchedPosts,
        maxPosts: count,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching posts failed!",
      });
    });
};


exports.getPostsByKeyWord = (req, res, next) => {
  const keyword = req.params.id.split("-")[0];
  const currentId = req.params.id.split("-")[1];
  const query = { $text: { $search: keyword } };



  let postQuery = Post.find(query)
  if(keyword == ""){
    postQuery = Post.find();
  }
  let irsfetchedPosts;

  postQuery
    .then((documents) => {
      fetchedPosts = documents;
      console.log(fetchedPosts)
      return Post.count();
    })
    .then((count) => {
      let tempFetchPosts
      if(fetchedPosts == undefined || fetchedPosts.length == 0){
        postQuery = Post.find();
        postQuery
        .then((documents) => {
          fetchedPosts = documents;
          console.log(fetchedPosts)
          return Post.count();
        })
        .then((count) => {
          res.status(200).json({
            message: "Posts fetched successfully!",
            posts: fetchedPosts,
            maxPosts: count,
          });
        })
        .catch((error) => {
          res.status(500).json({
            message: "Fetching posts failed!",
          });
        });
      }
      else{
        res.status(200).json({
          message: "Posts fetched successfully!",
          posts: fetchedPosts,
          maxPosts: count,
        });
      }

    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching posts failed!",
      });
    });




};

exports.getPost = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;

  postQuery
    .then((documents) => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then((count) => {
      let tempFetchPosts = fetchedPosts.filter(post=>post.creator.toString() == req.params.id)
      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: tempFetchPosts,
        maxPosts: count,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching posts failed!",
      });
    });



    Post.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Post not found!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching post failed!"
      });
    });
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then((result) => {
      console.log(result);
      if (result.n > 0) {
        res.status(200).json({ message: "Deletion successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Deleting posts failed!",
      });
    });
};

