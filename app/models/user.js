const mongoose = require('../../database')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    passwordResetToken: {
        type: String,
        select: false
    },
    passwordResetExpires: {
        type: String,
        select: false
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

    UserSchema.pre('save', async function (next) {
        const hash = await bcrypt.hash(this.password, 10)
        this.password = hash
        next()
    })


const User = mongoose.model('User', UserSchema);

module.exports = User;