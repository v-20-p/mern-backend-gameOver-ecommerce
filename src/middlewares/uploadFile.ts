import multer from 'multer'

const productsStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images/productsImages')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname)
    }
  })
  const usersStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images/usersimages')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname)
    }
  })
  export const uploadUserImg=multer({ storage: usersStorage })
  
  export const upload = multer({ storage: productsStorage })
