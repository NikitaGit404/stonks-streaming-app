import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
  chatCreator: {
    type: String,
    ref: "Channel",
    required: true,
  },
  members: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Channel" }],
    default: [],
  },
  messages: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
    default: [],
  },
  lastMessageAt: {
    type: Date,
    default: Date.now,
  },
});

const Chat = mongoose.models.Chat || mongoose.model("Chat", ChatSchema);

export default Chat;
