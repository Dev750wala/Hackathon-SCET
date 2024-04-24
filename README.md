# The project is still under work.

### DONE
* ```GET    /```                                  render home page
* ```GET    /user/login```                        render login page
* ```GET    /user/signup```                       render signup page
* ```POST   /user/login```                        login the user
* ```POST   /user/signup```                       create new user
* ```GET    /user/logout```                       logout the user
* ```GET    /user/:username```                    show user profile
* ```GET    /hackathon```                        render the page where all the projects will be displayed
* ```GET    /hackathon/:hackathonId```            render the page for specific details about the project
* ```POST   /hackathon/createHackathon```         creates a new project

### PENDING
* ```GET    /hackathon/createHackathon```         render the form page where the hackathon will be created
* ```GET    /user/updateProfile```                render the page for user update profile
* ```PUT    /user/updateProfile```                update the user profile
* ```GET    /hackathon/updateHackathon```         render the page for update the project details
* ```PUT    /hackathon/updateHackathon```         update the project
* ```GET    /hackathon/participate```             render the page for user to enroll in project
* ```GET    /my-projects```                       render the page for user to see their enrolled projects
* ```GET    /my-created-projects```              render the page for faculty user to see their created projects
* ```DELETE /user/deleteUser```                   delete the user
* ```DELETE /:hackathonId```                      delete the project

### ERROR HANDLING
* ```GET /error/404```                            render 404 Not Found page
* ```GET /error/500```                            render 500 Internal Server Error page
