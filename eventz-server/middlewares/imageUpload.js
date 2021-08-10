const multer = require('multer');
const path = require('path');


const uploadSingle = (fileName,destination,saveFileName) => {
    const storage = multer.diskStorage({
        destination: function(req,file,cb) {
            cb(null,destination);
        },
        filename: function(req,file,cb) {
            cb(null,saveFileName+path.extname(file.originalname));
        }
    });

    const upload = multer({
        storage: storage,
        // fileFilter: (req,file,cb) => {
        //     const sizeLimit = 2*1024*1024;
        //     if(file.size < sizeLimit) {
        //         cb(null,false);
        //         return cb(new Error("Images size can't be more than 2MB"))
        //     }
        //     cb(null,true);
        // } 
    }).single(fileName);
    return upload;
}

module.exports = uploadSingle;