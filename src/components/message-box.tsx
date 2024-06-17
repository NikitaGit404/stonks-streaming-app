import React from "react";
import { format } from "date-fns";
import { useSession } from "next-auth/react";

type MessageType = {
  text: string;
  createdAt: string;
  sender: {
    email: string;
    image: string;
    username: string;
  };
};

const MessageBox = ({ message }: { message: MessageType }) => {
  const { data: session } = useSession();
  return message?.sender?.email !== session?.user?.email ? (
    <div className="flex flex-row gap-2 items-center justify-start mb-2">
      <div className="flex flex-col items-center justify-start">
        <img src={message?.sender?.image} className="w-8 h-8 rounded-full" />
      </div>
      <div className="flex flex-col items-start bg-white px-4 py-2 rounded-lg text-base-medium break-words max-w-[200px]">
        <p className="text-xs font-medium">{message?.sender?.username}</p>
        <p className="break-words max-w-[175px]">{message?.text}</p>
      </div>

      <p className="text-xs text-gray-500">
        {format(new Date(message?.createdAt), "p")}
      </p>
    </div>
  ) : (
    <div className="flex flex-row gap-2 items-center justify-end mb-2">
      <p className="text-xs text-gray-500">
        {format(new Date(message?.createdAt), "p")}
      </p>

      <p className="bg-blue-200 px-4 py-2 rounded-lg max-w-[200px] break-words">
        {message?.text}
      </p>
    </div>
  );
};

export default MessageBox;
