const usersRoutes = require('./usersRoutes')
const postRoutes = require('./postRoutes')
const authRoute = require('./authRoutes')
const githubAuth = require('./githubAuth')
const googleAuth =  require('./googleAuth')
const { requireLogin } = require('../middlewares/auth')

module.exports = (app) => {
    app.use('/auth', authRoute)

    app.use('/auth', githubAuth)

    app.use('/auth', googleAuth)

    app.use('/api/user', usersRoutes)

    app.use('/api/posts', postRoutes)
}