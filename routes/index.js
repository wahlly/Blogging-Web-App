const usersRoutes = require('./usersRoutes')
const postRoutes = require('./postRoutes')

module.exports = (app) => {
    app.use('/api/users', usersRoutes)

    app.use('/api/posts', postRoutes)
}