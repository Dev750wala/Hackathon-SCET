import mongoose from "mongoose";
import USER from "../models/user-model";

export async function connectToDB() {
    const uri: string = process.env.DB_STRING!;

    
        await mongoose.connect(uri)
            .then(async () => {
                await USER.init();
                console.log("index created");
                const indexes = await mongoose.connection.db.collection('users').indexes();
                console.log(indexes);
                // const indexes = await mongoose.connection.db.collection('users').dropIndex('enrollmentNumber_1');
                // console.log(`droppped index: ${indexes}`);
            })
            .catch(err => console.error(err));
        // await USER.init();
        console.log(`Successfully connected to the database!`);
}

export async function disConnectfromDB() {
    try {
        await mongoose.disconnect();
        console.log(`Disconnected from the database`);        
    } catch (error: any) {
        console.log(`Error in disconnecting from the database: ${error}`);
    }
}

