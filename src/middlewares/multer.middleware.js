import multer from "multer";

// configure multer

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp")
  },
  filename: function (req, file, cb) {
    /* const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) ## can be used to save the file name in a unique way -> many ways possible
    cb(null, file.fieldname + '-' + uniqueSuffix) */
    cb(null, file.originalname)
  }
})

export const upload = multer({ 
    storage
})