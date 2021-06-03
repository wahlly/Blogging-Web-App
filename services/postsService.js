const Posts = require('../models/postsSchema');
const Users = require('../models/userSchema');

module.exports = class PostServices{

    static async createPost(content) {

        return Posts.create({
            author: {
                type: Schema.types.ObjectId,
                ref: 'Users'
            },
            content: content 
         })

    }
    /**
     * 
     * @desc get every posts ever created by a user
     */
    static async retrieveAllPosts(userId) {
        return Users.findOne(userId)
            .populate('Posts')
            .lean()
    }

    static async editPost(paramsId, content) {

        return Posts.updateOne({
            'content': content
        },
        {
            where: { '_id': paramsId }
        })

    }

    static async removePost(paramsId) {

        return Posts.deleteOne(paramsId)
    }
}