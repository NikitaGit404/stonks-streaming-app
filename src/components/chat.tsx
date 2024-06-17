import React, { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import MessageBox from "./message-box";

const Chat = ({ chatId }: { chatId: string }) => {
  const { data: session } = useSession();
  const [text, setText] = useState("");
  const [chat, setChat] = useState<any>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getChatDetails = async () => {
    try {
      const res = await fetch(`/api/chat/${chatId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setChat(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (session?.user && chatId) getChatDetails();
  }, [session, chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  const sendText = async () => {
    try {
      const res = await fetch("/api/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId,
          currentUserEmail: session?.user?.email,
          text,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setText("");
        setChat({
          ...chat,
          messages: [...chat.messages, data],
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-1/4 h-[90vh] rounded-lg bg-gray-200 flex flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        {chat?.messages?.map(
          (message: any, index: React.Key | null | undefined) => (
            <MessageBox key={index} message={message} />
          )
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-gray-300 flex flex-col md:flex-row rounded-b-lg">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendText();
            }
          }}
          placeholder="Type a message..."
          className="flex-1 p-2 rounded-l bg-gray-100 border border-gray-300 focus:outline-none w-full md:w-1/3"
        />
        <button
          className="bg-blue-500 text-white p-2 rounded-r"
          onClick={() => {
            sendText();
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
