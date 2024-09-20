const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjeceId = Schema.Types.ObjectId;

const user = new Schema({ 
            name: String,
            age : Number,
            // email: String,
            email: {type:String, unique: true},
            password: String
            });

const todo = new Schema({
    description: String,
    done: Boolean,
    userID: ObjeceId
});

const userModel = mongoose.model('users', user);
const todoModel = mongoose.model('todos', todo);

module.exports = {
    userModel,
    todoModel
    }