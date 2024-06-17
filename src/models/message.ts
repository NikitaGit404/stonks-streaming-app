import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Channel",
  },
  text: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  seenBy: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Channel" }],
    default: [],
  },
});

const Message =
  mongoose.models.Message || mongoose.model("Message", MessageSchema);

export default Message;
