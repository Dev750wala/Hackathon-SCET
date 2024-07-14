// Main gate for admin section 	GET	    /admin
// Create Admin Account: 		POST 	/admin/signup
// Login to Admin Account: 	    POST 	/admin/login
// Logout from Admin Account:   GET 	/admin/logout
// Create New Project: 		    POST 	/admin/projects/create-project
// Update Admin Profile: 		PUT 	/admin/:username
// Delete Project: 		        DELETE 	/admin/projects/:projectId
// Update Project: 		        PUT 	/admin/projects/:projectId
// list my created projects	    GET	    /admin/my-projects

import express from 'express';
import { handleAdminLogin, handleAdminLogout, handleAdminSignup, handleCreateProject, handleDeleteProject, handleListMyProjects, handleUpdateAdminProfile, handleUpdateProject, handleAdminAuth } from '../controllers/admin-controller';
import { adminAuth, checkAdminSignupFieldsEmptyOrNot, checkProjectCreationFieldsEmptyOrNot } from "../middlewares/admin-middleware"

const adminRoute: express.Router = express.Router();

adminRoute
    .post("/auth", handleAdminAuth)

    .post("/signup", adminAuth, checkAdminSignupFieldsEmptyOrNot, handleAdminSignup)

    .post("/login", adminAuth, handleAdminLogin)

    .post("/logout", handleAdminLogout)

    .post("/projects/create-project", adminAuth, checkProjectCreationFieldsEmptyOrNot, handleCreateProject)

    .put("/:username", adminAuth, handleUpdateAdminProfile)

    .delete("/projects/:projectId", adminAuth, handleDeleteProject)

    .put("/projects/:projectId", adminAuth, handleUpdateProject)

    .get("/my-projects", adminAuth, handleListMyProjects);

export default adminRoute;
