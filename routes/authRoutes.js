const { createNewUser, checkUsersLogin } = require('../controllers/userController')
const router = require('express').Router()


router.post('/register', (req, res) => createNewUser(req, res))

router.post('/login', (req, res) => checkUsersLogin(req, res))

module.exports = router