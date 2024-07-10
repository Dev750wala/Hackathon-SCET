import mongoose from "mongoose";

export async function connectToDB() {
    const uri: string = process.env.DB_STRING!;

    try {       
        await mongoose.connect(uri);
        console.log(`Successfully connected to the database!`);
    } catch (error: any) {
        console.log(`Error in connecting to the database ${error}`);
    }
    // console.log(` hello ${typeof process.env.DB_STRING}`);
    
}

export async function disConnectfromDB() {
    try {
        await mongoose.disconnect();
        console.log(`Disconnected from the database`);        
    } catch (error: any) {
        console.log(`Error in disconnecting from the database: ${error}`);
    }
}

