

module.exports = class Authenticate{
    static requireLogin(req, res, next){
        if(req.user) {
            next()
        }
        return res.status(401).json({
            status: 'failed',
            msg: 'Unauthorized user!'
        })
    }
}