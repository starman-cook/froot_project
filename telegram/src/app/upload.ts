const { nanoid } = require('nanoid');
const multer = require('multer');
const config = require('./config');
const path = require('path')

const storage = multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
        cb(null, config.uploadPath);
    },
    filename:(req: any, file: any, cb: any) => {
        cb(null, nanoid() + path.extname(file.originalname));
    }
});
export const upload = multer({storage});
