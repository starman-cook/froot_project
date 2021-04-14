"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const { nanoid } = require('nanoid');
const multer = require('multer');
const config = require('./config');
const path = require('path');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, nanoid() + path.extname(file.originalname));
    }
});
exports.upload = multer({ storage });
