import express from 'express';
import { handleGetUserData, handleGetUserSuggestionData } from '../controllers/api-controller';

const apiRoute: express.Router = express.Router();

apiRoute
    .get("/users/search", handleGetUserData)    

    // suggestion route while creating a team for a project.
    .get("/users/suggestions/search", handleGetUserSuggestionData);


export default apiRoute;