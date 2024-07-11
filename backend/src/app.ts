import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
// import { connectToDB, disConnectfromDB } from './utilities/connection';
import cookieParser from "cookie-parser"
import userRoute from './routes/user-routes';
import { checkUser } from './middlewares/middleware';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

const port = process.env.PORT || 3000;

// app.get("/", async (req: Request, res: Response) => {
// });
app.use('*', checkUser);

app.get("/", (req: Request, res: Response) => {
    return res.send("Hello World!");
})

app.use("/user", userRoute);
// app.use("/admin", adminRoute)

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
