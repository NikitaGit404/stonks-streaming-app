"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useGlobalStore } from "@/app/zustand/store";
import { FaRegCircleUser } from "react-icons/fa6";

const SignInOutButton = () => {
  const { data: session } = useSession();
  const { currentUsername } = useGlobalStore((state) => state);
  const router = useRouter();

  const handleStreamingBool = async () => {
    const res = await fetch(`/api/channel`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: currentUsername,
        email: session?.user?.email,
        isStreaming: false,
      }),
    });
    const data = await res.json();
  };

  if (session) {
    return (
      <div className=" flex flex-row">
        <Popover>
          <PopoverTrigger asChild>
            {session.user?.image ? (
              <img
                className="w-8 h-8 rounded-full my-auto ml-2 mr-0 cursor-pointer"
                src={session.user?.image}
                alt="user image"
              />
            ) : (
              <FaRegCircleUser className="w-8 h-8 rounded-full my-auto ml-2 mr-0 cursor-pointer" />
            )}
          </PopoverTrigger>
          <PopoverContent className=" w-36 px-0 py-2">
            <div className="flex flex-col items-start">
              <div
                onClick={() => {
                  router.push(`/channel/${currentUsername}`);
                }}
                className="cursor-pointer hover:bg-gray-100 w-full px-4 py-2"
              >
                My Profile
              </div>
              <div
                className="cursor-pointer hover:bg-gray-100 w-full px-4 py-2"
                onClick={async () => {
                  await handleStreamingBool();
                  signOut();
                }}
              >
                Log out
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  }
  return (
    <Button
      variant="outline"
      className="flex flex-row items-center space-x-2"
      onClick={() => {
        signIn("google");
      }}
    >
      <img src="/google_logo.svg" alt="Google" className="w-3 h-3" />
      <span>Join</span>
    </Button>
  );
};

export default SignInOutButton;
