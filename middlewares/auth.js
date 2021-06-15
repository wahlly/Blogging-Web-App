module.exports = class Authenticate{
    static requireLogin(req, res, next){
        try{
            if(req.user) {
                return next()
            }
            return res.status(401).json({
                status: 'failed',
                msg: 'Unauthorized user!'
            })
        }
        catch(err) {
            return res.status(500).json({
                status: 'error',
                msg: err
            })
        }
    }
}