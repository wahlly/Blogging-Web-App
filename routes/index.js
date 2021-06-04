const usersRoutes = require('./usersRoutes')
const postRoutes = require('./postRoutes')
const authRoute = require('./authRoutes')

module.exports = (app) => {
    app.use('/auth', authRoute)

    app.use('/api/posts', postRoutes)
}