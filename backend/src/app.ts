import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
// import { connectToDB, disConnectfromDB } from './utilities/connection';
import cookieParser from "cookie-parser"
import userRoute from './routes/user-routes';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

const port = process.env.PORT || 3000;

// app.get("/", async (req: Request, res: Response) => {
// });

app.get("/", (req: Request, res: Response) => {
    return res.send("Hello World!");
})

app.use("/user", userRoute);

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
