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
import { handleAdminLogin, handleAdminLogout, handleAdminSignup, handleCreateProject, handleDeleteProject, handleListMyProjects, handleUpdateAdminProfile, handleAdminAuth, handleUpdateProject } from '../controllers/admin-controller';
import { adminAuth, checkAdminSignupFieldsEmptyOrNot, checkProjectCreationFieldsEmptyOrNot, checkIfAdminAlreadyLoggedinOrNot } from "../middlewares/admin-middleware"
import { onlyLoggedInUsers } from '../middlewares/user-middleware';

const adminRoute: express.Router = express.Router();

adminRoute
    .post("/auth", handleAdminAuth)

    .post("/signup", adminAuth, checkIfAdminAlreadyLoggedinOrNot,  checkAdminSignupFieldsEmptyOrNot, handleAdminSignup)

    .post("/login", adminAuth, checkIfAdminAlreadyLoggedinOrNot, handleAdminLogin)

    .post("/logout", handleAdminLogout)

    .post("/projects/create-project", adminAuth, onlyLoggedInUsers, checkProjectCreationFieldsEmptyOrNot, handleCreateProject)

    .patch("/projects/:projectId", adminAuth, onlyLoggedInUsers, handleUpdateProject)

    .patch("/update-profile", adminAuth, onlyLoggedInUsers, handleUpdateAdminProfile)

    .delete("/projects/:projectId", adminAuth, onlyLoggedInUsers, handleDeleteProject)
    
    // .patch("/projects/:projectId", adminAuth, onlyLoggedInUsers, handleUpdateProject)

    .get("/my-projects", adminAuth, onlyLoggedInUsers, handleListMyProjects);

export default adminRoute;
