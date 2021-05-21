const Posts = require('../models/postsSchema');
const Users = require('../models/userSchema');

module.exports = class PostServices{

    static async createPost(content) {

        return Posts.create({
            author: {
                type: Schema.types.ObjectId,
                ref: 'Users'
            },
            'content': content 
         })

    }

    static async retrieveAllPosts(displayName) {
        return Users.findOne({ 'displayName': displayName }).populate('Posts')
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