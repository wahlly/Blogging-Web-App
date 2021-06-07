const Posts = require('../models/postsSchema');
const mongoose = require('mongoose')
const { UserSchema } = require('../models/userSchema');
const Users = mongoose.model('users', UserSchema)
const Validations = require('../validators/validator')

module.exports = class PostServices{

    /**
     * 
     * @desc create a new blog post
     * @param {post} content
     */
    static async createPost(paramsId, content) {
        try{
            const { error, isValid } = await Validations.newPost(content)

            if(!isValid) {
                return error
            }

            let user = await Users.findById(paramsId)
            let newPost = await new Posts({content})

            newPost.author = user
            return await newPost.save()
        }
        catch(err) {
            console.error(err)
        }

    }

    /**
     * 
     * @param {post id} paramsId 
     * @desc gets a single post by its id
     */
    static async retrievePost(paramsId) {
        try{
            return await Posts.findById(paramsId).lean()
        }
        catch(err) {
            console.error(err)
        }
    }

    /**
     * @param {id of user } userId
     * @desc get every posts ever created by a user
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
     * 
     * @param {post id} paramsId 
     * @param {blog post} content 
     * @desc edits a blog post using the post's id
     */
    static async editPost(paramsId, content) {
        try{
            return await Posts.findOneAndUpdate({_id: paramsId}, {content: content}, {new: true, runValidators: true})
        }
        catch(err) {
            console.error(err)
        }

    }

    /**
     * 
     * @param {post id} paramsId 
     * @desc deletes a post
     */
    static async removePost(paramsId) {
        try{
            return await Posts.findByIdAndDelete(paramsId)
        }
        catch(err) {
            console.error(err)
        }
    }
}