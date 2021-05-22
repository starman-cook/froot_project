const express = require('express')
const router = express.Router()
const Room = require('./models/Room')


router.post('/', async (req, res) => {
    try {
        const roomExists = await Room.findOne({room: req.body.room})
        if (roomExists) return res.res.status(400).send({message: "Комната с данным названием уже существует"})
        const room = await new Room(req.body)
        room.save()
        res.send(room)
    } catch(err) {
        res.status(500).send({error: "cannot create room, something went wrong"})
    }
})
router.get('/', async (req, res) => {
    try {
        const rooms = await Room.find()
        res.send(rooms)
    } catch(err) {
        res.status(500).send({error: err})
    }
})

router.delete('/:id', async (req, res) => {
    try {
        await Room.findByIdAndRemove(req.params.id)
        res.send({message: "Success"})
    } catch (err) {
        res.status(500).send({error: err})
    }
})

module.exports = router