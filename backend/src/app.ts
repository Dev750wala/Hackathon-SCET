import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { connectToDB, disConnectfromDB } from './utilities/connection';
import cookieParser from "cookie-parser"
import userRoute from './routes/user-routes';
import adminRoute from './routes/admin-routes';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
// app.use(checkUser)
app.use(function(req: Request, res, next) {
    console.log(`${req.originalUrl} ${req.ip} ${new Date().toISOString()}\n`);
    next();
})

const port = process.env.BACKEND_PORT || 3000;

// app.get("/", async (req: Request, res: Response) => {
// });

app.get("/", (req: Request, res: Response) => {
    return res.send("Hello World!");
})

app.use("/user", userRoute);
app.use("/admin", adminRoute);

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
