const mongoose = require("mongoose");

const childSchema = new mongoose.Schema({
  firstName: { type: String, required: [true, "Child first name is required."], trim: true },
  lastName: { type: String, required: [true, "Child last name is required."], trim: true },
  age: { type: Number, required: [true, "Child age is required."], min: [0, "Age cannot be negative."], max: [150, "Age must be realistic."] },
  email: { type: String, required: [true, "Child email is required."], trim: true, lowercase: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true }
}, { timestamps: true });

module.exports = mongoose.model("Child", childSchema);
