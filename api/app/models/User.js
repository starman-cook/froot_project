const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { nanoid } = require('nanoid')

const SALT_WORK_FACTOR = 10

const Schema = mongoose.Schema

const UserSchema = new Schema({
    workEmail: {
        type: String,
        required: true,
        unique: true,
        validate: [{
            validator: async value => {
                const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                if (!regex.test(value)) return false
            },
            message: 'Вы ввели неправильный email'
        }, {
            validator: async value => {
                const user = await User.findOne({ workEmail: value })
                if (user) return false
            },
            message: 'Такой сотрудник уже зарегистрирован'
        }]
    },
    surname: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    patronymic: {
        type: String
    },
    position: {
        type: String,
        required: true,
        default: 'user',
    },
    telegramName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        validate: {
            validator: async value => {
                const regex = /(?:\+|\d)[\d\-\(\) ]{9,}\d/g
                if (!regex.test(value)) return false
            },
            message: 'Вы ввели неправильный номер телефона'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: [6, "В пароле должно быть не менее 6 символов"],
        validate: {
            validator: async value => {
                const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/
                if (!regex.test(value)) return false
            },
            message: 'Пароль должен состоять из букв и цифр'
        }
    },
    role: {
        type: [String],
        required: true,
        enum: ['viewAllPayments', 'addPayment', 'editPayment', 'approvePayment', 'payPayment', 'postponePayment', 'viewToBePaid', 'viewTodayPayments', 'cancelApprovedPayment', 'cancelPayedPayment', 'deletePayment', 'stopRepeatabilityPayment', 'authorizeUser', 'editUser', 'deleteUser', 'viewUsers', 'bookMeetingRoom', 'editBookedMeetingRoom', 'deleteBookedMeetingRoom', 'viewBookingsMeetingRoom', 'addNewMeetingRoom', 'deleteMeetingRoom',  'addContentlink', 'viewOwnContentlinks', 'viewAllContentlinks', 'addNews', 'viewAllNews', 'changeStatusNews']
    },
    token: {
        type: [String],
        required: true,
        default: ["", ""]
    },
    chatId: String
})
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR)
    const hash = await bcrypt.hash(this.password, salt)
    this.password = hash
    next()
})
UserSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.password;
        return ret;
    }
})
UserSchema.methods.checkPassword = function (password) {
    return bcrypt.compare(password, this.password);
}
UserSchema.methods.generationToken = function (tokenType) {
    const copy = [...this.token]
    if (tokenType === 'telegram') {
        copy[1] = nanoid()
    } else {
        copy[0] = nanoid()
    }
    return this.token = copy;
}

const User = mongoose.model('User', UserSchema);
module.exports = User;