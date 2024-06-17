import { Schema, model, models } from "mongoose";

const ChannelSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  pushNotifications: { type: Boolean, required: true, default: false },
  followers: { type: [String], default: [] },
  following: { type: [String], default: [] },
  isStreaming: { type: Boolean, required: true, default: false },
});

const Channel = models.Channel || model("Channel", ChannelSchema);

export default Channel;
