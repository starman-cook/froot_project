const express = require('express');
const auth = require('./middleware/auth');
const permit = require('./middleware/permit');
const router = express.Router();
const User = require('./models/User');
const config=require('./config');
const logger=config.log4jsApi.getLogger("api");

const createRouter = () => {

    router.get('/',[auth, permit('viewUsers')],async (req, res) => {
        try {
            const users = await User.find()
            res.send(users);
        } catch (e) {
            logger.error('GET /users '+e);
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
            logger.error('POST /users '+e);
            res.status(400).send(e);
        }
    });
    router.get('/:id', [auth, permit('viewUsers')], async (req, res) => {
        try {
            const user = await User.findOne({ _id: req.params.id });
            res.send(user);
        } catch (e) {
            logger.error('GET /users/:id '+e);
            res.status(400).send(e);
        }

    })
    router.put('/:id/edit', [auth, permit('viewUsers', 'editUser')], async (req, res) => {
        try{
            const user = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, { useFindAndModify: false }, function (err, result) {
                if (err) {
                    console.log(err);
                }
            });
            await user.save({ validateBeforeSave: false });
            res.send(user);
        }
        catch(e){
            logger.error('PUT /users/:id/edit '+e);
        }
    });
    router.delete('/:id/delete', [auth, permit('deleteUser')], async (req, res) => {
        const user = await User.findByIdAndDelete(req.params.id);
        try {
            user.deleteOne();
            res.send({ message: 'user deleted!', _id: user._id });
        } catch (error) {
            logger.error('DELETE /users/:id/delete '+error);
            res.send(error);
        }
    });
    router.post('/sessions', async (req, res) => {
        try{
            const user = await User.findOne({ workEmail: req.body.workEmail });
            if (!user) {
                return res.status(400).send({ error: 'Неправильный email или пароль!' });
            }
            const isMatch = await user.checkPassword(req.body.password);
            if (!isMatch) {
                return res.status(400).send({ error: 'Неправильный email или пароль!' });
            }
            await user.generationToken('');
            await user.save({ validateBeforeSave: false });

            res.send({ message: 'Email and password correct!', user });
        }
        catch(e){
            logger.error('POST /users/sessions '+e);
        }
    })
    router.post('/telegram_sessions', async (req, res) => {
        try{
                const user = await User.findOne({ workEmail: req.body.workEmail });
            if (!user) {
                return res.status(400).send({ error: 'Сотрудник с таким email-ом не найден!' });
            }
            const isMatch = await user.checkPassword(req.body.password);
            if (!isMatch) {
                return res.status(400).send({ error: 'Неправильный пароль!' });
            }
            await user.generationToken('telegram')
            await user.save({ validateBeforeSave: false });
            res.send({ user: user })
        }
        catch(e){
            logger.error('POST /users/telegram_sessions '+e);
        }
    })
    router.delete('/sessions', auth, async (req, res) => {
        try{
            const user = req.user
            const success = { message: 'Success' }
            user.token = ''
            await user.save({ validateBeforeSave: false })
            return res.send(success)
        }
        catch(e){
            logger.error('DELETE /users/sessions '+e);
        }
    })
    router.post('/electron', async (req, res) => {
        try{
                const user = await User.findOne({ workEmail: req.body.workEmail });
            if (!user) {
                return res.status(400).send({ error: 'Неправильный email или пароль!' });
            }
            const isMatch = await user.checkPassword(req.body.password);
            if (!isMatch) {
                return res.status(400).send({ error: 'Неправильный email или пароль!' });
            }

            res.send({ message: 'Email and password correct!', user: user });
        }
        catch(e){
            logger.error('POST /users/electron '+e);
        }
    })
    return router;
}
module.exports = createRouter;