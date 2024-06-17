import mongoose from "mongoose";

const connect = async () => {
    const connectionState = mongoose.connection.readyState;

    if (connectionState === 1) {
        console.log("Already connected");
        return;
    }

    if (connectionState === 2) {
        console.log("Connecting...");
        return;
    }

    try {
        mongoose.connect(process.env.MONGODB_URI!, {
            dbName: "stonks_streaming_app_db",
            bufferCommands: false,
        });
        console.log("Connected");
    } catch (error) {
        console.log("Error in connecting to database", error);
        throw new Error("Error connecting to database");
    }
};

export default connect;
