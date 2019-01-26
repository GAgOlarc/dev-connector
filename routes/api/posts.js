const experss = require('express');
const router = experss.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load Validation
const validatePostInput = require('../../validation/post');

// Load Post Mode
const Post = require('../../models/Post');

router.get('/test', (req, res) => res.json({ msg: "Posts Works" }));

// @route GET api/posts
// @desc Get posts
// @access Public
router.get('/', (req, res) => {
    Post.find()
        .sort({ date: -1 })
        .then(posts => {
            if (!posts) {
                res.status(404).json('There are no posts');
            }

            res.status(200).json(posts);
        })
        .catch(err => res.status(404).json('There are no posts'));
});

// @route GET api/posts/:id
// @desc Get post by id
// @access Public
router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            if (!post) {
                res.status(404).json('There is no post associated with this id');
            }

            res.status(200).json(post);
        })
        .catch(err => res.status(404).json('There is no post associated with this id'));
});

// @route POST api/posts
// @desc Create post
// @access Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // Check Validation
    if (!isValid) {
        // Return any errors with 400 status
        return res.status(400).json(errors);
    }

    const newPost = new Post({
        text: req.body.text,
        name: req.user.name,
        avatar: req.user.avatar,
        user: req.user.id
    });

    newPost.save().then(post => res.json(post));
});

// @route DELETE api/posts
// @desc Delete post
// @access Private
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            //Check for post owner
            if (post.user.toString() !== req.user.id) {
                return res.status(401).json('User not authorized');
            }

            //Delete
            post.remove().then(() => res.json({ success: true }));
        })
        .catch(err => res.status(404).json('Post not found'));
});

// @route POST api/posts/like/:id
// @desc Like post
// @access Private
router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
                return res.status(400).json('User already liked this post');
            }

            //Add user id to likes array
            post.likes.unshift({ user: req.user.id });

            post.save().then(post => res.status(200).json(post));
        })
        .catch(err => res.status(404).json(err));
});

// @route POST api/posts/unlike/:id
// @desc Unlike post
// @access Private
router.post('/unlike/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
                return res.status(400).json('You have not liked this post');
            }

            // Get remove index
            const removeIndex = post.likes.map(like => like.user.toString())
                .indexOf(req.user.id);

            //Remove user id from likes array
            post.likes.splice(removeIndex, 1);

            post.save().then(post => res.status(200).json(post));
        })
        .catch(err => res.status(404).json(err));
});

// @route POST api/posts/comment/:post_id
// @desc  Add comment to post
// @access Private
router.post('/comment/:post_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // Check Validation
    if (!isValid) {
        // Return any errors with 400 status
        return res.status(400).json(errors);
    }

    Post.findById(req.params.post_id)
        .then(post => {
            const newComment = {
                text: req.body.text,
                name: req.user.name,
                avatar: req.user.avatar,
                user: req.user.id
            }

            //Add to comments array
            post.comments.unshift(newComment);

            post.save().then(post => res.status(200).json(post));
        })
        .catch(err => res.status(404).json('No comment found'));
});

// @route DELETE api/posts/comment/:post_id/:comment_id
// @desc  Delete comment from post
// @access Private
router.delete('/comment/:post_id/:comment_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Post.findById(req.params.post_id)
        .then(post => {
            // Get remove index
            const removeIndex = post.comments.findIndex(comment => comment._id.toString() === req.params.comment_id);

            // Check if comment exists
            if (removeIndex === -1) {
                return res.status(404).json('Comment does not exists');
            }

            if (post.comments[removeIndex].user.toString() !== req.user.id) {
                return res.status(400).json('This comment was not created by this user.');
            }

            // Splice comment out of array
            post.comments.splice(removeIndex, 1);

            post.save().then(post => res.status(200).json(post));
        })
        .catch(err => res.status(404).json('No comment found'));
});

module.exports = router;