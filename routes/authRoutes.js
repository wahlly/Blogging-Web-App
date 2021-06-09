const { createNewUser, checkUsersLogin, changePassword, requestPasswordChange } = require('../controllers/userController')
const router = require('express').Router()

//create a new user
router.post('/register', (req, res) => createNewUser(req, res))

//user login
router.post('/login', (req, res) => checkUsersLogin(req, res))

//user makes a request to enable her to change password
router.post('/resetPassword', (req, res) => requestPasswordChange(req, res))

//user creates a new password
router.post('/newPassword/:userId/:token', (req, res) => changePassword(req, res))

module.exports = router