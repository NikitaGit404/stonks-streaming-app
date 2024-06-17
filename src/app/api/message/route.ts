import Chat from "@/models/chat";
import Message from "@/models/message";
import Channel from "@/models/channel";
import connect from "@/lib/db";

export const POST = async (req: Request) => {
  try {
    await connect();

    const body = await req.json();

    const { chatId, currentUserEmail, text } = body;

    const channelObject = await Channel.findOne(
      { email: { $in: [currentUserEmail] } },
      "_id"
    );

    const currentUser = await Channel.findById(channelObject._id);

    const newMessage = await Message.create({
      chat: chatId,
      sender: currentUser,
      text,
      seenBy: currentUser,
    });

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { messages: newMessage._id },
        $set: { lastMessageAt: newMessage.createdAt },
      },
      { new: true }
    )
      .populate({
        path: "messages",
        model: Message,
        populate: { path: "sender seenBy", model: "Channel" },
      })
      .populate({
        path: "members",
        model: "Channel",
      })
      .exec();

    return new Response(JSON.stringify(newMessage), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Failed to create new message", { status: 500 });
  }
};
