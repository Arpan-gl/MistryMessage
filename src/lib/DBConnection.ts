import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection:ConnectionObject = {}

export const dbConnection = async ():Promise<void> => {
    // Check if we're already connected
    if(connection.isConnected) {
        console.log("Already connected to database");
        return;
    }

    try {
        // Set connection options with proper timeout values
        const db = await mongoose.connect(process.env.MONGODB_URL || '', {
            serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
            socketTimeoutMS: 45000,
        });
        
        // Store connection state
        connection.isConnected = db.connections[0].readyState;
        console.log("DB Connected Successfully", connection.isConnected);
    } catch (error) {
        console.log("MongoDB connection error:", error);
    }
}