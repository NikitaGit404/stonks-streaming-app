"use client";
import { Channel } from "@/app/types/types";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Chat from "@/components/chat";
import { Button } from "@/components/ui/button";

const StreamPage = () => {
  const { data: session } = useSession();
  const [channel, setChannel] = useState<Channel | undefined>(undefined);
  const [chatId, setChatId] = useState<string>("");
  const pathname = usePathname();
  const channelUsername = pathname.split("/")[2];
  const [isStreaming, setIsStreaming] = useState<boolean>(false);

  useEffect(() => {
    createChat();
  }, []);

  async function createChat() {
    const response = await fetch(`/api/channel?username=${channelUsername}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    setChannel(data);
    setIsStreaming(data?.isStreaming ?? false);
    if (data?.email === session?.user?.email) {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          currentUserEmail: session?.user?.email,
          members: data?.followers,
        }),
      });
      const chat = await res.json();
      console.log("first chat created: ", chat._id);
      setChatId(chat._id);
    } else {
      //todo
      const res = await fetch(`/api/chat?chatCreator=${data?.email}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const chatData = await res.json();
      console.log("chat joined: ", chatData._id);
      setChatId(chatData._id);
    }
  }

  return isStreaming ? (
    <div className="mx-3 flex flex-row gap-x-5">
      <div className="w-3/4">
        <iframe
          className="w-full h-[90vh]"
          allow="autoplay"
          src="https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=1"
        ></iframe>
      </div>
      {channel?.followers.includes(session?.user?.email as string) ||
      session?.user?.email === channel?.email ? (
        <Chat chatId={chatId}></Chat>
      ) : (
        <div className="w-1/4 px-2 bg-gray-200 rounded-lg">
          Please Login and Follow the channel to Chat
        </div>
      )}
    </div>
  ) : (
    <div className="text-center w-full mt-10 flex flex-col items-center">
      The user is not currently Streaming. Try again later.
      <Button
        onClick={() => {
          window.location.reload();
        }}
        className="mt-5"
      >
        Refresh
      </Button>
    </div>
  );
};

export default StreamPage;
