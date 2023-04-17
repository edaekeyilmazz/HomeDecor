// Eda Ekeyilmaz - 8823564
// Namitha Chevari - 8817006

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