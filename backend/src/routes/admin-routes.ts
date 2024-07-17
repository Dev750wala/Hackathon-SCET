// Main gate for admin section 	GET	    /admin
// Create Admin Account: 		POST 	/admin/signup
// Login to Admin Account: 	    POST 	/admin/login
// Logout from Admin Account:   GET 	/admin/logout
// Create New Project: 		    POST 	/admin/projects/create-project
// Update Admin Profile: 		PUT 	/admin/update-profile
// Delete Project: 		        DELETE 	/admin/projects/:projectId
// Update Project: 		        PUT 	/admin/projects/:projectId
// list my created projects	    GET	    /admin/my-projects

import express from 'express';
import { handleAdminLogin, handleAdminLogout, handleAdminSignup, handleCreateProject, handleDeleteProject, handleListMyProjects, handleUpdateAdminProfile, handleUpdateProject, handleAdminAuth } from '../controllers/admin-controller';
import { adminAuth, checkAdminSignupFieldsEmptyOrNot, checkProjectCreationFieldsEmptyOrNot } from "../middlewares/admin-middleware"
import { onlyLoggedInUsers } from '../middlewares/user-middleware';

const adminRoute: express.Router = express.Router();

adminRoute
    .post("/auth", handleAdminAuth)

    .post("/signup", adminAuth, checkAdminSignupFieldsEmptyOrNot, handleAdminSignup)

    .post("/login", adminAuth, handleAdminLogin)

    .post("/logout", handleAdminLogout)

    .post("/projects/create-project", adminAuth, onlyLoggedInUsers, checkProjectCreationFieldsEmptyOrNot, handleCreateProject)

    .put("/update-profile", adminAuth, onlyLoggedInUsers, checkAdminSignupFieldsEmptyOrNot, handleUpdateAdminProfile)

    .put("/projects/:projectId", adminAuth, onlyLoggedInUsers, handleUpdateProject)
    
    .delete("/projects/:projectId", adminAuth, onlyLoggedInUsers, handleDeleteProject)

    .get("/my-projects", adminAuth, onlyLoggedInUsers, handleListMyProjects);

export default adminRoute;
