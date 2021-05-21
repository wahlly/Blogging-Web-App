const PostServices = require('../services/postsService')


module.exports = class PostController{

    static async createNewPost(req, res) {

        try {
            let newPost = await PostServices.createPost(req.body.content)
            return res.status(200).json({
                status: 'success',
                newPost
            })
        }
        catch (error) {
            return res.status(500).json({
                status: 'failed',
                error
            })
        }

    }

    static async getAllPosts(req, res) {

        try {
            let post = await PostServices.retrieveAllPosts(req.params.displayName)
            return res.status(200).json({
                status: 'success',
                posts: post
            })
        }
        catch (error) {
            return res.status(500).json({
                status: 'failed',
                error
            })
        }

    }

    static async updatePost(req, res) {

        try {
            let post = await PostServices.editPost(req.params._id, req.body.content)
            return res.status(200).json({
                status: 'success',
                post: post
            })
        } catch (error) {
            return res.status(500).json({
                status: 'failed',
                error
            })
        }

    }

    static async deletePost(req, res) {

        try {
            let post = await PostServices.removePost(req.params._id)
            return res.status(200).json({
                status: 'success',
                post: post
            })
        }
        catch (error) {
            return res.status(500).json({
                status: 'success',
                error
            })
        }
    }
}