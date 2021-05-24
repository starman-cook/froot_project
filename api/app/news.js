const express = require('express');
const auth = require('./middleware/auth.js');
const router = express.Router();
const upload = require('./middleware/upload.js');
const permit = require('./middleware/permit.js');
const axios = require('axios');
const config = require('./config');
const logger=config.log4jsApi.getLogger("api");

const moment = require('moment');
const News = require('./models/News');

const createRouter = () => {

    router.post('/', [auth, upload.single('file')], async (req, res) => {
        try {
            const newsItem = new News(req.body);

            if (req.file) {
                newsItem.file = req.file.filename;
            }
            const today = moment().format('DD-MM-YYYY')
            newsItem.createDate = today
            newsItem.user = req.user._id;
            await newsItem.save();
            res.send(newsItem);
        } catch (err) {
            logger.error('POST /news '+err);
            res.status(400).send({ message: err });
        }
    });
    router.get('/', auth, async (req, res) => {
        try {
            const news = await News.find().populate(["user", "contentManager"]);
            res.send(news);
        } catch (e) {
            logger.error('GET /news '+e);
            res.status(500).send(e);
        }
    })
    router.get('/:id/:status', [auth, permit('changeStatusNews')], async (req, res) => {
        try {
            const newsItem = await News.findById(req.params.id)
            if(!newsItem.contentManager || (newsItem.contentManager && String(newsItem.contentManager._id) === String(req.user._id))) {
                newsItem.status = req.params.status
            }else {
                return res.send({message: 'Вы не можете изменить статус данной новости'})
            }
            if(String(newsItem.status) === 'Не сделано') {
                newsItem.contentManager = null
            }else{
                newsItem.contentManager = req.user._id
            }
            await newsItem.save();
            res.send(newsItem);
        } catch (error) {
            logger.error('GET /news/:id/:status '+error);
            res.status(404).send({ message: "Not found" });
        }
    })
    return router;
}

module.exports = createRouter;