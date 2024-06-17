import Chat from "@/models/chat";
import Channel from "@/models/channel";
import connect from "@/lib/db";

export const POST = async (req: Request) => {
  try {
    await connect();

    const body = await req.json();

    const { currentUserEmail, members } = body;
    console.log("currentUserEmail", currentUserEmail);
    console.log("members", members);
    // Convert email addresses to ObjectIds
    const memberObjects = await Channel.find(
      { email: { $in: [currentUserEmail, ...members] } },
      "_id"
    );
    const memberIds = memberObjects.map((member) => member._id);
    console.log("memberIds", memberIds);
    // const query = { members: [...memberIds] };
    const query = { chatCreator: currentUserEmail };
    let chat = await Chat.findOne(query);

    if (!chat) {
      chat = new Chat({ members: memberIds, chatCreator: currentUserEmail });

      await chat.save();

      const updateAllMembers = chat.members.map(async (memberId: string) => {
        await Channel.findByIdAndUpdate(
          memberId,
          {
            $addToSet: { chats: chat._id },
          },
          { new: true }
        );
      });
      await Promise.all(updateAllMembers);
    }

    return new Response(JSON.stringify(chat), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Failed to create a new chat", { status: 500 });
  }
};

export const GET = async (req: Request) => {
  try {
    await connect();

    // Get the chatCreator email from the query parameters
    const url = new URL(req.url);
    const chatCreator = url.searchParams.get("chatCreator");

    if (!chatCreator) {
      return new Response("chatCreator parameter is required", { status: 400 });
    }

    const chat = await Chat.findOne({ chatCreator: chatCreator });

    if (!chat) {
      return new Response("Chat not found", { status: 404 });
    }

    return new Response(JSON.stringify(chat), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Failed to fetch chat", { status: 500 });
  }
};
