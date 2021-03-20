"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
var nanoid = require('nanoid').nanoid;
var multer = require('multer');
var config = require('./config');
var path = require('path');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, config.uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, nanoid() + path.extname(file.originalname));
    }
});
exports.upload = multer({ storage: storage });
