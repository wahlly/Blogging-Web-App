const Posts = require('../models/postsSchema');
const mongoose = require('mongoose')
const { UserSchema } = require('../models/userSchema');
const Users = mongoose.model('users', UserSchema)
const Validations = require('../validators/validator')
const multipleFiles = require('../models/multipleFiles')
const fileSizeFormatter = require('../utils/fileUploads/sizeFormatter')
const singleFile = require('../models/singleFile')

module.exports = class PostServices{
    /**
     * @desc create a new blog post
     * @param {String} content
     * @param {Number} userId
     * @return {Promise<post>}
     */
    static async createPost(userId, content) {
        try{
            const { error, isValid } = await Validations.newPost(content)

            if(!isValid) {
                return error
            }

            let user = await Users.findById(userId)
            let newPost = await new Posts({content})

            newPost.author = user
            return await newPost.save()
        }
        catch(err) {
            console.error(err)
        }

    }

    /**
     * @desc gets a single post by its id
     * @param {Number} postId 
     * @return {Promise<QueryResult>}
     */
    static async retrievePost(postId) {
        try{
            return await Posts.findById(postId).lean()
        }
        catch(err) {
            console.error(err)
        }
    }

    /**
     * @desc get every posts ever created by a user
     * @param {Number} userId
     * @return {Promise<QueryResult>}
     */
    static async retrieveAllPosts(userId) {
        try{
            return await Posts.find({author: userId}).lean()
        }
        catch(err) {
            console.error(err)
        }
    }

    /**
     * @desc edits a blog post using the post's id
     * @param {Number} postId 
     * @param {String} content 
     * @return {Promise<QueryResult>}
     */
    static async editPost(paramsId, content) {
        try{
            const { error, isValid } = await Validations.newPost(content)
            if(!isValid) {
                return error
            }

            return await Posts.findOneAndUpdate({_id: paramsId}, {content: content}, {new: true, runValidators: true})
        }
        catch(err) {
            console.error(err)
        }

    }

    /**
     * @desc deletes a post by its id
     * @param {Number} postId 
     * @return {Promise}
     */
    static async removePost(postId) {
        try{
            return await Posts.findByIdAndDelete(postId)
        }
        catch(err) {
            console.error(err)
        }
    }

    /**
     * @desc uploads a single file to the database
     * @param {Number} userId 
     * @param {Object} file 
     * @returns {Promise}
     */
    static async uploadSingleFile(userId, file) {
        try {
            const uploadedFile = new singleFile({
                userId: userId,
                fileName: file.originalname,
                filePath: file.path,
                fileType: file.mimetype,
                fileSize: fileSizeFormatter(file.size, 2) //i.e 0.00 2dp
            })
            return await uploadedFile.save()
        }
        catch(err) {
            console.error(err)
        }
    }

    /**
     * @desc uploads multiple files to the database
     * @param {Number} userId 
     * @param {http-req} Request 
     * @returns {Promise}
     */
    static async uploadMultipleFiles(userId, Request) {
        try {
            let filesArray = []
            Request.files.forEach(element => {
                const file = {
                    fileName: element.originalname,
                    filePath: element.path,
                    fileType: element.mimetype,
                    fileSize: fileSizeFormatter(element.size, 2)
                }
                filesArray.push(file)
            })
            const multipleFile = new multipleFiles({
                userId: userId,
                title: Request.body.title,
                files: filesArray
            })
            return await multipleFile.save()
        }
        catch(err) {
           console.error(err)
        }
    }

    /**
     * @desc gets all single files that belongs to a specified user using the userId
     * @param {Number} userId 
     * @returns {Promise<singleFiles>}
     */
    static async retrieveAllSingleFiles(userId) {
        try {
            return await singleFile.find({ userId: userId})
        }
        catch(err) {
           console.error(err)
        }
    }

    /**
     * @desc gets all multiple files that belongs to a specified user using the userId
     * @param {Number} userId 
     * @returns {Promise<multipleFiles>}
     */
    static async retrieveMultipleFiles(userId) {
        try {
            return await multipleFiles.find({ userId: userId})
        }
        catch(err) {
            console.error(err)
        }
    }
}