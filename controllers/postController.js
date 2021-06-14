const PostServices = require('../services/postsService')

module.exports = class PostController{

    /**
     * @route PoST /api/posts/:id
     * @param {userId} req.params
     * @param {blog content} req.body
     * @returns newly created post
     */
    static async createNewPost(req, res) {

        try {
            let userId = req.params.id
            let content = req.body.content

            let newPost = await PostServices.createPost(userId, content)

            if(!newPost.content) {
                return res.status(400).json({
                    status: 'failed',
                    msg: 'error, a post must be provided!'
                })
            }

            return res.status(200).json({
                status: 'success',
                newPost
            })
        }
        catch (error) {
            console.error(error)
            return res.status(500).json({
                status: 'failed',
                msg: 'server error'
            })
        }

    }

    /**
     * @route GET /api/posts/:id
     * @param {post id} req
     * @desc get a single post by the post's id 
     */
    static async getPost(req, res) {
        try{
            let post = await PostServices.retrievePost(req.params.id)

            if(!post) {
                return res.status(404).json({
                    status:'failed',
                    msg: 'Post not found'
                })
            }

            return res.status(200).json({
                status: 'success',
                post: post
            })
        }
        catch(err) {
            return res.status(500).json({
                status: 'failed',
                msg: 'server error'
            })
        }
    }

    /**
     * 
     * @param {post author} req 
     * @route GET /api/posts/user/:authorId
     * @desc get every posts that belong to a specified author, using the author's id
     * @returns all the given user's post
     */
    static async getAllPosts(req, res) {

        try {
            let post = await PostServices.retrieveAllPosts(req.params.author)

            if(!post) {
                return res.status(404).json({
                    status: 'failed',
                    msg: "user's posts not found"
                })
            }
            return res.status(200).json({
                status: 'success',
                posts: post
            })
        }
        catch (error) {
            return res.status(500).json({
                status: 'failed',
                msg: 'server error'
            })
        }

    }

    /**
     * @route PUT /api/posts/edit/:postId
     * @param {post id} req
     * @param {post content} req.body 
     * @returns updated post
     */
    static async updatePost(req, res) {

        try {
            let post = await PostServices.editPost(req.params.id, req.body.content)

            if(!post) {
                return res.status(404).json({
                    status: 'failed',
                    msg: 'Post not found'
                })
            }
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

    /**
     * @route DELETE 
     * @param {post id} req 
     * @desc finds the post by its id and deletes it
     * @returns success/error message on completion
     */
    static async deletePost(req, res) {

        try {
            let post = await PostServices.removePost(req.params.id)

            if(!post) {
                return res.status(400).json({ msg: 'Bad request' })
            }
            return res.status(200).json({
                status: 'success',
                msg: 'deleted successfully'
            })
        }
        catch (error) {
            return res.status(500).json({
                status: 'success',
                error
            })
        }
    }

    static async singleFileUpload(req, res) {
        try {
            let file = req.file
            let uploadedFile = await PostServices.uploadSingleFile(req.params.id, file)
            if(!uploadedFile) {
                return res.status(400).json({
                    status: 'failed',
                    msg: 'unable to upload'
                })
            }
            res.status(200).json({
                status: 'success',
                msg: 'File uploaded successfully'
            })
        }
        catch(err) {
            console.error(err)
            res.status(400).json({
                status: 'failed',
                msg: err.message
            })
        }
    }

    static async multipleFileUpload(req, res){
        try {
          const files = await PostServices.uploadMultipleFiles(req.params.id, req)
          if(!files) {
              return res.status(400).json({
                  status: 'failed',
                  msg: 'An error occured while uploading the files'
              })
          }

            res.status(200).json({
                status: 'success',
                msg: 'Files uploaded successfully'
            })
        }
        catch(err) {
            res.status(400).json({
                status: 'failed',
                msg: err.message
            })
        }
    }

    static async getAllSingleFiles(req, res) {
        try {
            const files = await PostServices.retrieveAllSingleFiles(req.params.id)
            if(!files) {
                return res.status(400).json({
                    status: 'failed',
                    msg: 'unable to retrieve posts'
                })
            }

            res.status(200).json({
                status: 'success',
                files
            })
        }
        catch(err) {
            res.status(400).json({
                status: 'failed',
                error: err.message
            })
        }
    }

    static async getAllMultipleFiles(req, res) {
        try {
            const files = await PostServices.retrieveMultipleFiles(req.params.id)
            if(!files || files == null) {
                return res.status(400).json({
                    status: 'failed',
                    msg: 'oops, unable to get files'
                })
            }

            res.status(200).json({
                status: 'success',
                files
            })
        }
        catch(err) {
            res.status(400).json({
                status: 'failed',
                error: err.message
            })
        }
    }
}