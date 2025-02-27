import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from "cookie-parser"
import userRoute from './routes/user-routes';
import adminRoute from './routes/admin-routes';
import projectRoute from './routes/project-routes';
import apiRoute from './routes/api-routes';
import { checkUser } from './middlewares/user-middleware';
import cors from "cors";

import { connectToDB } from './utilities/connection';
connectToDB();

// (async () => {
//     await connectToDB();
// })();

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,  
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(function(req: Request, res, next) {
    console.log(`${req.originalUrl} ${req.ip} ${new Date().toISOString()}\n`);
    next();
})

const port = process.env.BACKEND_PORT || 3000;

// app.get("/", async (req: Request, res: Response) => {
// });
// connectToDB()


app.use("*", checkUser);
app.get("/", (req: Request, res: Response) => {
    console.log(req.user);
    return res.send("Hello World!");
})

app.use("/user", userRoute);
app.use("/admin", adminRoute);
app.use("/project", projectRoute);
// /api are routes for searching functionality in the frontend.
app.use("/api", apiRoute);

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});