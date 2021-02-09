// User model here
const mongoose = require("mongoose");

let UserSchema = new mongoose.Schema({
    username: String,
    password: {
      type: String,
      required: true
    }
  })

  let UserModel = mongoose.model('user', UserSchema)

  module.exports = UserModel
