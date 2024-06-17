import React, { useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Channel } from "@/app/types/types";
import { GrChannel } from "react-icons/gr";

const ChannelCard = ({ channel }: { channel: Channel }) => {
    return (
        <Link href={`/channel/${channel.username}`}>
            <Card className="w-[350px] m-2">
                <CardHeader>
                    <CardTitle>{channel.name}</CardTitle>
                    <CardDescription>{channel.email}</CardDescription>
                </CardHeader>
                <CardContent>
                    {channel.image ? (
                        <img
                            src={channel.image!}
                            alt={channel.name ?? "Channel Image"}
                            className="w-full h-48 object-cover"
                        />
                    ) : (
                        <GrChannel />
                    )}
                </CardContent>
            </Card>
        </Link>
    );
};

export default ChannelCard;
