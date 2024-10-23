const mongoose = require("mongoose");
const bcryptjs = require("bcrypt");

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
  },

  lastName: {
    type: String,
    required: [true, "Last name is required"],
  },

  email: {
    type: String,
    required: [true, "Email is required"],
    unique: [true, "Email should be unique"],
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email",
    ],
  },

  password: {
    type: String,
    required: true,
    minlength: 8,
    validate: {
      validator: function (value) {
        return /[A-Z]/.test(value) && /[0-9]/.test(value);
      },
      message: (props) =>
        `Password must contain at least one uppercase letter and one number!`,
    },
  },

  profilePic: {
    type: String,
  },

  lastSeen: {
    type: Date,
    default: Date.now,
  },

  friends: [
    {
      friendsID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
  ],
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcryptjs.hash(this.password, 10);

  next();
});
module.exports = mongoose.model("User", userSchema);
