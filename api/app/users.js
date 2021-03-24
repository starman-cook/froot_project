const express = require('express');
const auth = require('./middleware/auth');
const permit = require('./middleware/permit');
const router = express.Router();
const User = require('./models/User');

const createRouter = () => {
    router.get('/', [auth, permit('admin')], async (req, res) => {
        try {
            const users = await User.find()
            res.send(users);
        } catch (e) {
            res.status(500).send(e);
        }
    });
    router.post('/', async (req, res) => {
        const user = new User({
            workEmail: req.body.workEmail,
            surname: req.body.surname,
            name: req.body.name,
            patronymic: req.body.patronymic,
            position: req.body.position,
            telegramName: req.body.telegramName,
            phone: req.body.phone,
            role: req.body.role,
            password: req.body.password,
        });
        try {
            user.generationToken();
            await user.save();
            res.send(user);
        } catch (e) {
            res.status(400).send(e);
        }
    });
    router.get('/:id', [auth],async (req,res) => {
        try {
            const user = await User.findOne({_id: req.params.id});
            res.send(user);
        } catch(e) {
            res.status(400).send(e);
        }
       
    })
    router.put('/:id/edit', [auth, permit('admin')], async (req, res) => {
        const user = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, { useFindAndModify: false }, function (err, result) {
            if (err) {
                console.log(err);
            }
        });
        await user.save();
        res.send(user);
    });
    router.delete('/:id/delete', [auth, permit('admin')], async (req, res) => {
        const user = await User.findById(req.params.id);
        try {
            user.deleteOne();
        } catch (error) {
            res.send(error);
        }
        res.send({ message: 'user deleted!', _id: user._id  });
    });
    router.post('/sessions', async (req, res) => {
        const user = await User.findOne({ workEmail: req.body.workEmail });
        if (!user) {
            return res.status(400).send({ error: 'Неправильный email или пароль!' });
        }
        const isMatch = await user.checkPassword(req.body.password);
        if (!isMatch) {
            return res.status(400).send({ error: 'Неправильный email или пароль!' });
        }
        user.generationToken();
        await user.save({ validateBeforeSave: false });

        res.send({ message: 'Email and password correct!', user });
    })
    router.post('/telegram_sessions', async (req, res) => {
        const user = await User.findOne({ workEmail: req.body.workEmail });
        if (!user) {
            return res.status(400).send({ error: 'Сотрудник с таким email-ом не найден!' });
        }
        const isMatch = await user.checkPassword(req.body.password);
        if (!isMatch) {
            return res.status(400).send({ error: 'Неправильный пароль!' });
        }
        user.chatId = req.body.chatId
        await user.save({ validateBeforeSave: false });
        res.send({ user: user })
        //res.send({message: 'Email and password correct!'});
    })
    router.delete('/sessions', auth, async (req, res) => {
        const user = req.user
        const success = { message: 'Success' }
        user.token = ''
        await user.save({ validateBeforeSave: false })
        return res.send(success)
    })
    return router;
}
module.exports = createRouter;