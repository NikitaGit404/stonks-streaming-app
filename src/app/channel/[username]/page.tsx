"use client";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Channel } from "@/app/types/types";
import { GrChannel } from "react-icons/gr";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useGlobalStore } from "@/app/zustand/store";
import { useRouter } from "next/navigation";
import { Knock } from "@knocklabs/node";

interface ChannelProfileProps {
  params: {
    username: string;
  };
}
const ChannelProfile = ({ params }: ChannelProfileProps) => {
  const router = useRouter();
  const { currentUsername } = useGlobalStore((state) => state);
  const { currentUserDetails } = useGlobalStore((state) => state);
  const { data: session } = useSession();
  const [channel, setChannel] = React.useState<Channel | undefined>(undefined);
  const [isStreaming, setIsStreaming] = React.useState<boolean>(false);
  const { toast } = useToast();
  console.log("isStreaming", isStreaming);
  useEffect(() => {
    getChannel();
  }, []);

  useEffect(() => {
    if (channel?.username) handleStreamingBool();
  }, [channel, isStreaming]);

  const getChannel = async () => {
    const res = await fetch(`/api/channel?username=${params.username}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    setChannel(data);
    setIsStreaming(data?.isStreaming ?? false);
  };

  const handleStreamingBool = async () => {
    const res = await fetch(`/api/channel`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: channel?.username,
        email: channel?.email,
        isStreaming: isStreaming,
      }),
    });
    const data = await res.json();
    console.log("data", data);
    if (res.ok) {
      getChannel();
    } else {
      toast({
        duration: 2000,
        variant: "destructive",
        title: "Uh oh!",
        description: "There was a problem with your request.",
      });
    }
  };

  const handleFollow = async () => {
    if (!session) {
      toast({
        duration: 2000,
        variant: "destructive",
        title: "Uh oh! Please login first.",
        description: "There was a problem with your request.",
      });
    } else {
      const res = await fetch(`/api/channel/follow`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          followerEmail: session?.user?.email,
          followedEmail: channel?.email,
        }),
      });
      const data = await res.json();
      if (
        data.message === "Successfully updated following and followers list"
      ) {
        getChannel();
        toast({
          duration: 2000,
          variant: "default",
          title: "Success!",
          description: "You have followed the channel.",
        });
      } else {
        toast({
          duration: 2000,
          variant: "destructive",
          title: "Uh oh!",
          description: "There was a problem with your request.",
        });
      }
    }
  };

  const sendNotification = async () => {
    const knockClient = new Knock(
      "sk_test_aDBqNU0Xbv-tmCGx16gE45UIjI9clQXH2Qn4dfHlxqc"
    );
    await knockClient.notify("stream-app-workflow", {
      actor: session?.user?.email ?? "",
      recipients: channel?.followers,
      data: {
        username: channel?.username,
      },
    });
  };

  return (
    <div>
      <Card className="w-1/2 mx-auto mt-8">
        <CardHeader>
          {channel?.image ? (
            <img
              src={channel?.image}
              className="w-1/3 h-1/3 rounded-full mx-auto mb-5"
            />
          ) : (
            <GrChannel className="w-1/3 h-1/3 rounded-full mx-auto mb-5" />
          )}
          <CardTitle className="mx-auto">@{channel?.username}</CardTitle>
          <CardDescription className="mx-auto">
            {channel?.email}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 w-1/2 mx-auto">
            <div className="text-center border py-2 rounded-tl-lg rounded-bl-lg">
              Followers {channel?.followers?.length}
            </div>
            <div className="text-center border py-2 rounded-tr-lg rounded-br-lg">
              Following {channel?.following?.length}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="mx-auto flex-row space-x-4">
            {channel?.followers?.includes(session?.user?.email ?? "") ? (
              <Button
                className="bg-blue-400 text-white mx-auto hover:bg-red-600 hover:text-white"
                variant="outline"
                disabled={true}
              >
                Following
              </Button>
            ) : (
              session?.user?.email !== channel?.email && (
                <Button
                  className="bg-blue-500 text-white mx-auto hover:bg-blue-600 hover:text-white"
                  variant="outline"
                  onClick={() => handleFollow()}
                >
                  Follow
                </Button>
              )
            )}
            {currentUsername === channel?.username ? (
              <Button
                className={`${
                  isStreaming
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                } text-white mx-auto  hover:text-white`}
                variant="outline"
                onClick={() => {
                  if (!isStreaming) {
                    sendNotification();
                    setIsStreaming(true);
                    router.push(`/channel/${currentUsername}/stream`);
                  } else {
                    setIsStreaming(false);
                  }
                }}
              >
                {isStreaming ? "Stop Streaming" : "Start Streaming"}
              </Button>
            ) : (
              <Button
                className="bg-red-500 text-white mx-auto hover:bg-red-600 hover:text-white"
                disabled={!isStreaming}
                variant="outline"
                onClick={() => {
                  router.push(`/channel/${channel?.username}/stream`);
                }}
              >
                Join Stream
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
      <Toaster />
    </div>
  );
};

export default ChannelProfile;
