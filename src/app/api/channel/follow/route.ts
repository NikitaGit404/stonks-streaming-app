import { NextResponse } from "next/server";
import connect from "@/lib/db";
import Channel from "@/models/channel";

export const PATCH = async (request: Request) => {
  try {
    const body = await request.json();
    const { followerEmail, followedEmail } = body;
    if (!followerEmail || !followedEmail) {
      return new NextResponse(
        "Both follower and followed emails are required",
        { status: 400 }
      );
    }

    await connect();

    // Update the following list of the follower
    const followerChannel = await Channel.findOneAndUpdate(
      { email: followerEmail },
      { $addToSet: { following: followedEmail } },
      { new: true }
    );

    if (!followerChannel) {
      return new NextResponse("Follower channel not found", {
        status: 404,
      });
    }

    // Update the followers list of the followed channel
    const followedChannel = await Channel.findOneAndUpdate(
      { email: followedEmail },
      { $addToSet: { followers: followerEmail } },
      { new: true }
    );

    if (!followedChannel) {
      return new NextResponse("Followed channel not found", {
        status: 404,
      });
    }

    return new NextResponse(
      JSON.stringify({
        message: "Successfully updated following and followers list",
        follower: followerChannel,
        followed: followedChannel,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        message: "Error in updating following and followers list",
        error,
      }),
      { status: 500 }
    );
  }
};
