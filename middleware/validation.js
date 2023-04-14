const validateProduct = (req,res,next)=>{
    if(req.files == null || req.body.title == null){
    return res.redirect('/posts/new')
    }
    next()
}

export { 
    validateProduct
}
// const validateMiddleware = require("./middleware/validateMiddleware");