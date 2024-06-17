"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import SignInOutButton from "./sign-in-out-button";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGlobalStore } from "@/app/zustand/store";
import Notifications from "../notifications";

const Navbar = () => {
  const { data: session } = useSession();
  const { setCurrentUsername } = useGlobalStore((state) => state);
  const { setCurrentUserDetails } = useGlobalStore((state) => state);
  const [showDialog, setShowDialog] = useState(false);
  const [username, setUsername] = useState("");
  const [pushNotifications, setPushNotifications] = useState(false);
  useEffect(() => {
    if (session) {
      getChannels();
    }
  }, [session]);

  const getChannels = async () => {
    const response = await fetch(`/api/channel?email=${session?.user?.email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 404) {
      setShowDialog(true);
    } else {
      setShowDialog(false);
      const data = await response.json();
      setCurrentUsername(data.username);
      setCurrentUserDetails(data);
    }
  };

  const createNewChannel = async () => {
    const response = await fetch("/api/channel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: session?.user?.email ?? "",
        name: session?.user?.name ?? "",
        image: session?.user?.image ?? "",
        username,
        pushNotifications,
      }),
    });
    if (response.status === 201) {
      setShowDialog(false);
    } else {
      console.error("Error in creating channel");
    }
  };
  return (
    <>
      <nav className="bg-blue-50 border-gray-500 dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a
            href="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img
              src="https://www.stonks.com/_next/image?url=%2Fstonks-megaphone.png&w=256&q=75"
              alt="logo"
              className="w-10 h-10 rounded-full "
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Streaming App
            </span>
          </a>

          <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <Notifications />
            <SignInOutButton />
          </div>
        </div>
      </nav>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Setup your profile</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input
                id="username"
                className="col-span-3"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="flex flex-row mx-auto w-full justify-end items-center gap-4">
              <Checkbox
                id="pushNotifications"
                checked={pushNotifications}
                onCheckedChange={() => {
                  setPushNotifications(!pushNotifications);
                }}
              />
              <Label
                htmlFor="pushNotifications"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Enable Push Notifications
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" onClick={() => createNewChannel()}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Navbar;
