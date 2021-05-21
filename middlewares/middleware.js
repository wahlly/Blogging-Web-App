const express = require('express')

module.exports = (app) => {
    //body-parser middlewares
    app.use(express.json())
    app.use(express.urlencoded({extended: false}))

}