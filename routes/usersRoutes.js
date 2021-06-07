const router = require('express').Router()
const { getUserByDisplayName, updateUserProfile, createNewUser, checkUsersLogin, deleteUser } = require('../controllers/userController')


/** @route POST to create a new user*/
router.post('/register', (req, res) => createNewUser(req, res))

/**@route PoST to authenticate a user's login */
router.post('/login', (req, res) => checkUsersLogin(req, res))

/**@route GET to find a user by its displayName*/
router.get('/:displayName', (req, res) => getUserByDisplayName(req, res))

/**@route PUT to edit a user's profile */
router.put('/:id', (req, res) => updateUserProfile(req, res))

/**@route DELETE to delete a user's profile */
router.delete('/:id', (req, res) => deleteUser(req, res))


module.exports = router