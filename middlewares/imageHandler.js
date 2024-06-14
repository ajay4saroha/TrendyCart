import multer from 'multer'
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'public/uploads/productsImages/')
    },
    filename:function(req,file,cb){
        cb(null,`${Date.now()}-${file.originalname}`)
    }
})
const fileFilter = function fileFilter(req,file,cb){
    if((file.mimetype).startsWith('image')){
        req.unsupportedFile = false
        cb(null,true)
    }
    else{
        req.unsupportedFile = true
        cb(null,false)
    }
}
const imageHandler = multer({storage:storage,fileFilter:fileFilter})
export{imageHandler}