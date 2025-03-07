const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
    fullName:{type: String, required: true},
    cpf: {type: String, required: true, unique: true},
    login: {type: String, required: true, unique: true},
    password: {type: String, required: true}, 
}, {timestamps: true} );

UserSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
})

UserSchema.methods.comparePassword = async function(candidatePassword){
    return bcrypt.compare(candidatePassword, this.password);
};

const Client = mongoose.model('User', ClientSchema);

module.exports = Client;