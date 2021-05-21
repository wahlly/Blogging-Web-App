const usersRoutes = require('./usersRoutes')
const postRoutes = require('./postRoutes')

module.exports = (app) => {
    app.use('/api/user', usersRoutes)

    app.use('/api/post', postRoutes)
}