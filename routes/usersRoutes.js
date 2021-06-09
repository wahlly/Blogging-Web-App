const router = require('express').Router()
const { getUserByDisplayName, updateUserProfile, createNewUser, checkUsersLogin, deleteUser } = require('../controllers/userController')


/**@route GET to find a user by its displayName*/
router.get('/:displayName', (req, res) => getUserByDisplayName(req, res))

/**@route PUT to edit a user's profile */
router.put('/:id', (req, res) => updateUserProfile(req, res))

/**@route DELETE to delete a user's profile */
router.delete('/:id', (req, res) => deleteUser(req, res))


module.exports = router