import { Router } from "express";

import express from 'express';
import { handleShowProject } from "../controllers/project-controller";

const projectRoute: express.Router = express.Router();


projectRoute.
    get("/:projectId", handleShowProject);

export default projectRoute;