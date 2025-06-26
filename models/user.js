const {isEmail}=require('validator');
const bcrypt=require('bcrypt');
const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
}, { timestamps: true }
);

userSchema.pre('save', async function (next) {
     const salt=await bcrypt.genSalt();
     this.password=await bcrypt.hash(this.password,salt);

    next();
});

userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email: email });
    if (user) {
         const auth=await bcrypt.compare(password,user.password);
        if(auth){
            return user;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email');
}

const User = model('user', userSchema);
module.exports = User;
