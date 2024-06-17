import Chat from "@/models/chat";
import Message from "@/models/message";
import Channel from "@/models/channel";
import connect from "@/lib/db";

type Params = {
  params: {
    chatId: string;
  };
};

export const GET = async (req: Request, { params }: Params) => {
  try {
    await connect();

    const { chatId } = params;

    const chat = await Chat.findById(chatId)
      .populate({
        path: "members",
        model: Channel,
      })
      .populate({
        path: "messages",
        model: Message,
        populate: {
          path: "sender seenBy",
          model: Channel,
        },
      })
      .exec();

    return new Response(JSON.stringify(chat), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Failed to get chat details", { status: 500 });
  }
};

export const POST = async (req: Request, { params }: Params) => {
  try {
    await connect();

    const { chatId } = params;

    const body = await req.json();

    const { currentUserId } = body;

    await Message.updateMany(
      { chat: chatId },
      { $addToSet: { seenBy: currentUserId } },
      { new: true }
    )
      .populate({
        path: "sender seenBy",
        model: Channel,
      })
      .exec();

    return new Response("Seen all messages by current user", { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Failed to update seen messages", { status: 500 });
  }
};
