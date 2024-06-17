"use client";
import React, { useEffect } from "react";
import ChannelCard from "@/components/channel-card";
import { Channel } from "@/app/types/types";
import { Input } from "@/components/ui/input";

const AllChannels = () => {
  const [channels, setChannels] = React.useState<Channel[]>([]);
  const [search, setSearch] = React.useState<string>("");
  useEffect(() => {
    getAllChannels();
  }, []);

  const getAllChannels = async () => {
    const res = await fetch("/api/channel", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    setChannels(data);
  };

  return (
    <div className="flex flex-col my-6 items-center">
      <Input
        className="w-1/3"
        placeholder="Search for channels"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      />
      <div className="flex flex-row flex-wrap mx-auto w-full justify-center pt-2">
        {channels
          .filter(
            (channel) =>
              channel.email?.includes(search) ||
              channel.username?.includes(search)
          )
          .map((channel) => (
            <ChannelCard key={channel.username} channel={channel} />
          ))}
      </div>
    </div>
  );
};

export default AllChannels;
