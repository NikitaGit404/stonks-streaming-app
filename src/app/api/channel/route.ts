import { NextResponse } from "next/server";
import connect from "@/lib/db";
import Channel from "@/models/channel";

const ObjectId = require("mongoose").Types.ObjectId;

export const GET = async (request: Request) => {
  try {
    await connect();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const username = searchParams.get("username");
    let channels;
    if (email) {
      channels = await Channel.findOne({ email: email });
      if (!channels) {
        return new NextResponse("Channel not found", { status: 404 });
      }
    } else if (username) {
      channels = await Channel.findOne({ username: username });
      if (!channels) {
        return new NextResponse("Channel not found", { status: 404 });
      }
    } else {
      channels = await Channel.find();
    }
    return new NextResponse(JSON.stringify(channels), { status: 200 });
  } catch (error) {
    return new NextResponse("Error in fetching channels" + error, {
      status: 500,
    });
  }
};

export const POST = async (request: Request) => {
  try {
    const body = await request.json();

    await connect();
    const newChannel = new Channel(body);
    await newChannel.save();

    return new NextResponse(
      JSON.stringify({
        message: "Channel is created",
        channel: newChannel,
      }),
      { status: 201 }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        message: "Error in creating channel",
        error,
      }),
      {
        status: 500,
      }
    );
  }
};

export const PATCH = async (request: Request) => {
  try {
    const body = await request.json();
    const { username, email, isStreaming } = body;

    if (typeof isStreaming !== "boolean") {
      return new NextResponse("Invalid isStreaming value", { status: 400 });
    }

    await connect();
    let channel;

    if (email) {
      channel = await Channel.findOneAndUpdate(
        { email: email },
        { isStreaming: isStreaming },
        { new: true }
      );
    } else if (username) {
      channel = await Channel.findOneAndUpdate(
        { username: username },
        { isStreaming: isStreaming },
        { new: true }
      );
    } else {
      return new NextResponse("Username or email is required", { status: 400 });
    }

    if (!channel) {
      return new NextResponse("Channel not found", { status: 404 });
    }

    return new NextResponse(
      JSON.stringify({
        message: "Channel is updated",
        channel: channel,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        message: "Error in updating channel",
        error,
      }),
      {
        status: 500,
      }
    );
  }
};
