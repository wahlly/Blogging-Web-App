const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')
const mongoose = require('mongoose')
const { UserSchema } = require('../models/userSchema')
const Users = mongoose.model('users', UserSchema)
chai.use(chaiHttp)

//assertion style
const { expect } = require('chai')

describe('Users', () => {

    describe('user Registration', () => {
        afterEach((done) => {
            Users.deleteOne({ displayName: 'test' })
            done()
        })
        it('should create a new user', (done) => {
            const user = {
                "firstName": "Mocha",
                "lastName": "chai",
                "displayName": "test",
                "email": "test@gmail.com",
                "password": "M12345678c.",
                "country": "Javascript",
                "tel": "9878764098"
            }

            chai.request(server)
                .post('/auth/register')
                .send(user)
                .end((err, res) => {
                    expect(res).to.have.status(200)
                    expect(res.body.profile).haveOwnProperty('firstName')
                    expect(res.body.profile).haveOwnProperty('lastName')
                    expect(res.body.profile).haveOwnProperty('displayName')
                    expect(res.body.profile).haveOwnProperty('email')
                    expect(res.body.profile).haveOwnProperty('country')
                    expect(res.body.profile).haveOwnProperty('tel')
                    expect(res.body.profile).to.not.haveOwnProperty('password')
                    done()
                })
        })

        it('should not create user due to weak password', (done) => {
            const user = {
                "firstName": "Mocha",
                "lastName": "chai",
                "displayName": "test",
                "email": "test@gmail.com",
                "password": "M12345678",
                "country": "Javascript",
                "tel": "9878764098"
            }
            chai.request(server)
                .post('/auth/register')
                .send(user)
                .end((err, res) => {
                    expect(res).to.have.status(400)
                    expect(res.body.status).eq('failed')
                    expect(res.body.error.msg).eq('password is not strong enough!')
                    done()
                })
        })

        it('should not create a user due to omission of displayName', (done) => {
            const user = {
                "firstName": "Mocha",
                "lastName": "chai",
                "displayName": " ",
                "email": "test@gmail.com",
                "password": "M12345678c.",
                "country": "Javascript",
                "tel": "9878764098"
            }
            chai.request(server)
                .post('/auth/register')
                .send(user)
                .end((err, res) => {
                    expect(res).to.have.status(500)
                    expect(res.body.status).eq('failed')
                    done()
                })
        })

        it('should not create a user due to omission of firstName', (done) => {
            const user = {
                "firstName": " ",
                "lastName": "chai",
                "displayName": "test",
                "email": "test@gmail.com",
                "password": "M12345678c.",
                "country": "Javascript",
                "tel": "9878764098"
            }
            chai.request(server)
                .post('/auth/register')
                .send(user)
                .end((err, res) => {
                    expect(res).to.have.status(400)
                    expect(res.body.status).eq('failed')
                    expect(res.body.error.msg).eq('Names must be completely filled with only alphabets!')
                    done()
                })
        })

        it('should not create a user due to omission of lastName', (done) => {
            const user = {
                "firstName": "Mocha",
                "lastName": " ",
                "displayName": "test",
                "email": "test@gmail.com",
                "password": "M12345678c.",
                "country": "Javascript",
                "tel": "9878764098"
            }
            chai.request(server)
                .post('/auth/register')
                .send(user)
                .end((err, res) => {
                    expect(res).to.have.status(400)
                    expect(res.body.status).eq('failed')
                    expect(res.body.error.msg).eq('Names must be completely filled with only alphabets!')
                    done()
                })
        })
    })

    it('should not create a user due to omission or improper email', (done) => {
        const user = {
            "firstName": "Mocha",
            "lastName": "chai",
            "displayName": "test",
            "email": " ",
            "password": "M12345678c.",
            "country": "Javascript",
            "tel": "9878764098"
        }
        chai.request(server)
            .post('/auth/register')
            .send(user)
            .end((err, res) => {
                expect(res).to.have.status(400)
                expect(res.body.status).eq('failed')
                expect(res.body.error.msg).eq('please, input a valid email!')
                done()
            })
    })

    
    it('should not create a user due to input of less than minimum required digits for tel', (done) => {
        const user = {
            "firstName": "Mocha",
            "lastName": "chai",
            "displayName": "test",
            "email": "test@gmail.com",
            "password": "M12345678c.",
            "country": "Javascript",
            "tel": "987876409"
        }
        chai.request(server)
            .post('/auth/register')
            .send(user)
            .end((err, res) => {
                expect(res).to.have.status(400)
                expect(res.body.status).eq('failed')
                expect(res.body.error.msg).eq('please, provide a valid phone number')
                done()
            })
    })

    it('should not create a user due to suspicion of unallowed tel', (done) => {
        const user = {
            "firstName": "Mocha",
            "lastName": "chai",
            "displayName": "test",
            "email": "test@gmail.com",
            "password": "M12345678c.",
            "country": "Javascript",
            "tel": "9dkf67nc0kc8"
        }
        chai.request(server)
            .post('/auth/register')
            .send(user)
            .end((err, res) => {
                expect(res).to.have.status(400)
                expect(res.body.status).eq('failed')
                expect(res.body.error.msg).eq('please, input a valid telephone number')
                done()
            })
    })

    describe('User login', () => {
        it('should grant user access', (done) => {
            chai.request(server)
                .post('/auth/login')
                .send({
                    email: 'test@gmail.com',
                    password: 'M12345678c.'
                })
                .end((err, res) => {
                    expect(res).to.have.status(200)
                    expect(res.body.status).eq('success')
                    expect(res.body).haveOwnProperty('token')
                    done()
                })
        })

        it('should deny user access due to wrong/non-existing email', (done) => {
            chai.request(server)
                .post('/auth/login')
                .send({
                    email: 'tes@gmail.com',
                    password: 'M12345678c.'
                })
                .end((err, res) => {
                    expect(res).to.have.status(401)
                    expect(res.body.status).eq('failed')
                    expect(res.body.msg).eq('User not found, Register to become a user!')
                    done()
                })
        })

        
        it('should deny user access due to wrong password', (done) => {
            chai.request(server)
                .post('/auth/login')
                .send({
                    email: 'test@gmail.com',
                    password: 'M12345678d.'
                })
                .end((err, res) => {
                    expect(res).to.have.status(401)
                    expect(res.body.status).eq('failed')
                    expect(res.body.msg).eq('oops, wrong password! try again')
                    done()
                })
        })
    })

    describe('reset password request', () => {
        it('should send a password reset token', (done) => {
            chai.request(server)
                .post('/auth/resetPassword')
                .send({
                    email: 'john@gmail.com'
                })
                .end((err, res) => {
                    expect(res).to.have.status(200)
                    expect(res.body).haveOwnProperty('token')
                    done()
                })
        })

        it('should send a user not found error', (done) => {
            chai.request(server)
                .post('/auth/resetPassword')
                .send({
                    email: 'jon@gmail.com'
                })
                .end((err, res) => {
                    expect(res).to.have.status(404)
                    expect(res.body.msg).eq('User not found!')
                    done()
                })
        })
    })

    describe('reset password', () => {
        it('should reset user\'s password', (done) => {
            chai.request(server)
                .post('/auth/newPassword/60bf583f5d22363eb00cfac3/c3f57aa273c20a8ac7a51e2b3528088e1846154cc02fc887cd018675f2680f4e')
                .send({
                    password: 'J12345678d.'
                })
                .end((err, res) => {
                    expect(res).to.have.status(200)
                    expect(res.body).haveOwnProperty("newPasswordReset")
                    expect(res.body.newPasswordReset).haveOwnProperty('firstName')
                    expect(res.body.newPasswordReset).haveOwnProperty('lastName')
                    expect(res.body.newPasswordReset).haveOwnProperty('displayName')
                    expect(res.body.newPasswordReset).haveOwnProperty('email')
                    expect(res.body.newPasswordReset).haveOwnProperty('country')
                    expect(res.body.newPasswordReset).haveOwnProperty('tel')
                    expect(res.body.newPasswordReset).to.not.haveOwnProperty('password')
                    done()
                })
        })
    })

    describe('Get user', () => {
        it('should get a user by displayName', (done) => {
            chai.request(server)
                .get('/api/user/jdoe')
                .end((err, res) => {
                    expect(res).to.have.status(200)
                    expect(res.body.status).eq('success')
                    expect(res.body).haveOwnProperty('profile')
                    expect(res.body.profile).haveOwnProperty('firstName')
                    expect(res.body.profile).haveOwnProperty('lastName')
                    expect(res.body.profile).haveOwnProperty('displayName')
                    expect(res.body.profile).haveOwnProperty('email')
                    expect(res.body.profile).haveOwnProperty('tel')
                    expect(res.body.profile).haveOwnProperty('country')
                    expect(res.body.profile).to.not.haveOwnProperty('password')
                    done()
                })
        })

        it('should not get a user due to input of wrong/non-existing displayName', (done) => {
            chai.request(server)
                .get('/api/user/jdo')
                .end((err, res) => {
                    expect(res).to.have.status(404)
                    expect(res.body).haveOwnProperty('msg')
                    expect(res.body.msg).eq('User not found')
                    done()
                })
        })
    })

    describe('Update user\'s profile by its id', () => {
        it('should update user\'s profile', (done) => {
            chai.request(server)
                .put('/api/user/60bf583f5d22363eb00cfac3')
                .send({
                    tel: '98987878787',
                    displayName: 'jdoe',
                    email: 'john@gmail.com',
                    country: 'London'
                })
                .end((err, res) => {
                    expect(res).to.have.status(200)
                    expect(res.body).haveOwnProperty('profile')
                    expect(res.body.profile.displayName).eq('jdoe')
                    expect(res.body.profile.email).eq('john@gmail.com')
                    expect(res.body.profile.country).eq('London')
                    done()
                })
        })

        it('should not update user\'s profile due to uncompleted fields', (done) => {
            chai.request(server)
                .put('/api/user/60bf583f5d22363eb00cfac3')
                .send({
                    tel: '',
                    displayName: 'jdoe',
                    email: 'john@gmail.com',
                    country: 'London'
                })
                .end((err, res) => {
                    expect(res).to.have.status(400)
                    expect(res.body).haveOwnProperty('error')
                    expect(res.body.status).eq('failed')
                    done()
                })
        })

        it('should not update user\'s profile due to wrong form of email address', (done) => {
            chai.request(server)
                .put('/api/user/60bf583f5d22363eb00cfac3')
                .send({
                    tel: '7786868547',
                    displayName: 'jdoe',
                    email: 'john',
                    country: 'London'
                })
                .end((err, res) => {
                    expect(res).to.have.status(400)
                    expect(res.body).haveOwnProperty('error')
                    expect(res.body.status).eq('failed')
                    done()
                })
        })
    })

    describe('Delete user\'s profile', () => {
        it('should delete a user\'s profile', (done) => {
            chai.request(server)
                .delete('/api/user/60bf583f5d22363eb00cfac3')
                .end((err, res) => {
                    expect(res).to.have.status(200)
                    expect(res.body.msg).eq('user\'s data has been erased successfully')
                    done()
                })
        })

        it('should return an error while trying to delete a non existing account', (done) => {
            chai.request(server)
                .delete('/api/user/60bf583f5d22363eb00cfac3')
                .end((err, res) => {
                    expect(res).to.have.status(400)
                    expect(res.body.msg).eq('Unable to complete your request')
                    expect(res.body.status).eq('failed')
                    done()
                })
        })
    })
})