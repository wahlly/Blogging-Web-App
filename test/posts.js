const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')
const Posts = require('../models/postsSchema')
chai.use(chaiHttp)

//assertion style
const { expect } = require('chai')

describe('posts', () => {

    describe('GET /api/posts/user/:userId', () => {
        it('should GET every posts created by the user', (done) => {
            chai.request(server)
                .get('/api/posts/user/60bf583f5d22363eb00cfac3')
                .end((err, res) => {
                    expect(res).to.have.status(200)
                    expect(res.body.posts).to.be.a('array')
                    done()
                })
        })

        it('should not return any post', (done) => {
            chai.request(server)
            .get('/api/user/60bf583f5d22363eb00cfac3')
            .end((err, res) => {
                expect(res).to.have.status(404)
                expect(res.body.msg).to.eq('User not found')
                expect(res.body.status).to.eq('failed')
                expect(res.body).to.be.a('object')
                done()
            })
        })
    })

    describe('GET /api/posts/:postid', () => {
        it('should get a single post by its id', (done) => {
            chai.request(server)
                .get('/api/posts/60d19e19fdab732a10cc81eb')
                .end((err, res) => {
                    expect(res).to.have.status(200)
                    expect(res.body.status).to.eq('success')
                    expect(res.body.post).to.be.a('object')
                    expect(Object.keys(res.body.post).length).to.eq(6)
                    done()
                })
        })
    })

    describe('create a post to /api/posts/:userId', () => {
        afterEach((done) => {
            Posts.deleteMany({}, (err) =>{
                done()
            })
        })
        it('should create a new post', (done) => {
            const post = {
                content: 'write some tests'
            }
            chai.request(server)
                .post('/api/posts/60bf583f5d22363eb00cfac3')
                .send(post)
                .end((err, res) => {
                    expect(res).to.have.status(200)
                    expect(Object.keys(res.body.newPost).length).to.eq(6)
                    expect(res.body.newPost).to.have.ownProperty('content')
                    expect(res.body.newPost).to.have.ownProperty('_id')
                    expect(res.body.newPost).to.have.ownProperty('author')
                    expect(res.body.newPost).to.have.ownProperty('content').eq('write some tests')
                    done()
                })
        })

        it('should not create a post', (done) => {
            const post = {
                content: ''
            }
            chai.request(server)
                .post('/api/posts/60bf583f5d22363eb00cfac3')
                .send(post)
                .end((err, res) => {
                    expect(res).to.have.status(400)
                    expect(res.body.status).to.eq('failed')
                    expect(res.body.msg).to.eq('error, a post must be provided!')
                    expect(res.body).to.be.a('object')
                    done()
                })
        })

        it('should not create a post', (done) => {
            const post = {
                content: '53453453'
            }
            chai.request(server)
                .post('/api/posts/60bf583f5d22363eb00cfac3')
                .send(post)
                .end((err, res) => {
                    expect(res).to.have.status(400)
                    expect(res.body.status).to.eq('failed')
                    expect(res.body.msg).to.eq('error, a post must be provided!')
                    expect(res.body).to.be.a('object')
                    done()
                })
        })
    })

    describe('update a post', () => {
        it('should update a post', (done) => {
            const post = {
                content: 'write unit tests'
            }
            chai.request(server)
                .put('/api/posts/edit/60d1cd56b5bc70138070cce0')
                .send(post)
                .end((err, res) => {
                    expect(res).to.have.status(200)
                    expect(Object.keys(res.body.post).length).to.eq(6)
                    expect(res.body.post).to.have.ownProperty('content')
                    expect(res.body.post).to.have.ownProperty('_id')
                    expect(res.body.post).to.have.ownProperty('author')
                    expect(res.body.post).to.have.ownProperty('content').eq('write unit tests')
                    done()
                })
        })

        it('should not update', (done) => {
            const post = {
                content: ''
            }
            chai.request(server)
                .put('/api/posts/edit/60d1cd56b5bc70138070cce0')
                .send(post)
                .end((err, res) => {
                    expect(res).to.have.status(400)
                    expect(res.body.status).to.eq('failed')
                    expect(res.body.post.msg).to.eq('you cannot submit an empty post!')
                    done()
                })
        })

        it('should not update', (done) => {
            const post = {
                content: '7767775556'
            }
            chai.request(server)
                .put('/api/posts/edit/60d1cd56b5bc70138070cce0')
                .send(post)
                .end((err, res) => {
                    expect(res).to.have.status(400)
                    expect(res.body.status).to.eq('failed')
                    expect(res.body.post.msg).to.eq('post cannot contain only numbers!')
                    done()
                })
        })
    })

    describe('delete a post', () => {
        it('should delete a post', (done) => {
            chai.request(server)
                .delete('/api/posts/60d217a0fb533e437cd7761f')
                .end((err, res) => {
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.a('object')
                    expect(res.body.msg).to.eq('deleted successfully')
                    done()
                })
        })
    })

    it('should not delete a post', (done) => {
        chai.request(server)
            .delete('/api/posts/60d217a0fb533e437cd7761f')
            .end((err, res) => {
                expect(res).to.have.status(400)
                expect(res.body.msg).to.eq('Bad request')
                done()
            })
    })
})