import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection:ConnectionObject = {}

export const dbConnection = async ():Promise<void> => {
    if(connection){
        console.log("Already connected to database");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URL || '',{});
        console.log("DB Connect Successfully",db.connections[0].readyState);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}