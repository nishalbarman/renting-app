const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    phone: { type: Number, required: true },
    status: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Message =
  mongoose.models.messages || mongoose.model("messages", messageSchema);

// ----------------------------------------->
/****************************************** */
/**        Messages Schema Validator       **/
/****************************************** */
// ----------------------------------------->

Message.schema.path("name").validate({
  validator: function (value) {
    return value.length > 2;
  },
  message: "name required",
});

Message.schema.path("email").validate({
  validator: function (value) {
    var tester =
      /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
    return value && tester.test(value);
  },
  message: "enter valid email!",
});

Message.schema.path("message").validate({
  validator: function (value) {
    return value.length > 10;
  },
  message: "Message minimum length should be 10 characters",
});

Message.schema.path("phone").validate({
  validator: function (value) {
    return value.toString().length === 10;
  },
  message: "phone number must be of 10 digit",
});

module.exports = Message;
