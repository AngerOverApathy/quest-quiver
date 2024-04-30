const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: false,
        trim: true, // Trims whitespace from the username
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true, // Ensures the email is stored in lowercase
        match: [/.+\@.+\..+/, 'Please fill a valid email address'] // Regex to validate email
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    register_date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true // Automatically generates createdAt and updatedAt fields
});

// Pre-save hook to hash password before saving to the database
userSchema.pre('save', async function(next) {
    const user = this;

    // Only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
});

// Method to compare a candidate password with the user's password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Create the model from the schema and export it
const User = mongoose.model('User', userSchema);
module.exports = User;
