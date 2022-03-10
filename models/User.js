const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true, //this flag tells mongoose that each email needs to be unique
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

//Hash and Salt the password before the user is saved to the DB
userSchema.pre('save', function(next) {
    const user = this;
    //if the user's password is not modified (not already hashed and salted)
    if(!user.isModified('password')) {
        return next();
    }

    bcrypt.genSalt(10, (err, salt) => {
        if(err) {
            return next(err);
        }

        bcrypt.hash(user.password, salt, (err, hash) => {
            if(err) {
                return next(err);
            }
            user.password = hash;
            next(); 
        })
    });
});

//automate password checking process when a user signs in
userSchema.methods.comparePassword = function(candidatePassword) {
    const user = this;
    //using Promise here for async await, since this process will take time
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
            if(err) {
                return reject;
            }

            //passwords don't match
            if(!isMatch) {
                return reject(false)
            }
            resolve(true);
        });
    });
}

mongoose.model('User', userSchema);