const jsw = require('jsonwebtoken')

function isAuthenticated(req,res,next){
    if(!req.headers.authorization){
        return res.status(401).send()
    }
    const [,token] = req.headers.authorization.split(' ')

    const isMatchToken = jsw.verify(token, 'SECRET')

    if(!isMatchToken){
        return res.status(401).send()
      
    }
    return next()
}

module.exports = isAuthenticated;
