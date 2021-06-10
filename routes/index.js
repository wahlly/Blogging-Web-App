const usersRoutes = require('./usersRoutes')
const postRoutes = require('./postRoutes')
const authRoute = require('./authRoutes')
const { requireLogin } = require('../middlewares/auth')

module.exports = (app) => {
    app.use('/auth', authRoute)

    app.use('/login', githubAuth)

    app.use('/api/user', usersRoutes)

    app.use('/api/posts', requireLogin, postRoutes)
}