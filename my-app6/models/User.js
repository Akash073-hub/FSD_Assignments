const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: [true, "First name is required."], trim: true },
  lastName: { type: String, required: [true, "Last name is required."], trim: true },
  email: { type: String, required: [true, "User email is required."], trim: true, lowercase: true },
  phone: { type: String, required: [true, "Phone number is required."], trim: true }
}, { timestamps: true });

userSchema.index({ email: 1 }, { unique: true });
module.exports = mongoose.model("User", userSchema);
