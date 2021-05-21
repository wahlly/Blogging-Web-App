const router = require('express').Router()
const { createNewPost, getAllPosts, updatePost, deletePost } = require('../controllers/postController')

/**@route POST to create a new post */
router.post('/', (req, res) => createNewPost(req, res))

/**@route GET to get every posts made by a user */
router.get('/:displayName', (req, res) => getAllPosts(req, res))

/**@route PUT to edit a post made by a user */
router.post('/:_id', (req, res) => updatePost(req, res))

/**@route DELETE to delete a post created by a user */
router.delete('/:_id', (req, res) => deletePost(req, res))


module.exports = router