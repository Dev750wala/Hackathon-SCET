import express from 'express';
import { handleGetUserData } from '../controllers/api-controller';

const apiRoute: express.Router = express.Router();

apiRoute
    .get("/users/search", handleGetUserData)    


export default apiRoute;