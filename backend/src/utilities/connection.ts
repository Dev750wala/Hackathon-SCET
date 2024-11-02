import mongoose from "mongoose";
import USER from "../models/user-model";

let isConnected = false; // Track the connection status

export async function connectToDB() {
    if (isConnected) {
        console.log('Already connected to MongoDB.');
        return;
    }

    try {
        const uri: string = process.env.DB_STRING!;
        
        await mongoose.connect(uri);

        isConnected = true;
        console.log('Successfully connected to the database!');

        await USER.init();
        console.log('User model indexes created.');

        const indexes = await mongoose.connection.db.collection('users').indexes();
        console.log('Indexes:', indexes);
    } catch (error) {
        console.error('Error connecting to the database:', error);
        isConnected = false;
    }
}


export async function disConnectfromDB() {
    try {
        await mongoose.disconnect();
        console.log(`Disconnected from the database`);
    } catch (error: any) {
        console.log(`Error in disconnecting from the database: ${error}`);
    }
}

