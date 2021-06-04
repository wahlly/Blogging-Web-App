const router = require('express').Router()
const { createNewPost, getAllPosts, updatePost, deletePost, getPost } = require('../controllers/postController')

/**@route POST to create a new post */
router.post('/:id', (req, res) => createNewPost(req, res))

/**@route GET to get a single post by the post id */
router.get('/:id', (req, res) => getPost(req, res))

/**@route GET to get every posts made by a user */
router.get('/user/:author', (req, res) => getAllPosts(req, res))

/**@route PUT to edit a post made by a user */
router.put('/edit/:id', (req, res) => updatePost(req, res))

/**@route DELETE to delete a post created by a user */
router.delete('/:id', (req, res) => deletePost(req, res))


module.exports = router