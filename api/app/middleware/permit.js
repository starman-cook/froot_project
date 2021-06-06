const permit = (...roles) => {

    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).send({ 'message': 'Unauthenticated' })
        }
       
        [...roles].map(role => {
            if (!req.user.role.includes(role)) {
                return res.status(403).send({ 'message': 'Unauthorized' })
            }
        });
        
        next()
    }
}
module.exports = permit