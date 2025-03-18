
## Architecture

![image](https://github.com/user-attachments/assets/0c7168d4-8512-494e-b498-54769430db0a)


DeployEase is an automated deployment system designed to take a public GitHub repository URL containing a React project, build it, and serve it for public access. It consists of multiple services working together to manage the entire deployment lifecycle.

## Workflow
1. The user submits a public GitHub repository URL through the frontend.
2. The Upload Service processes the request, uploads the project files to S3, and adds a unique ID to the Redis queue.
3. The Deploy Service listens to the Redis queue, picks up the deployment task, downloads the files from S3, builds the project, and prepares it for hosting.
4. Once the deployment is successful, the URL of the deployed project is sent back to the frontend.
5. The Request Handler serves the static files to users, making the deployed application publicly accessible.

## Services

### Redis
Redis is used as a message queue to manage deployment tasks. When a user submits a request, a unique identifier is generated and pushed into Redis. This ID is later retrieved by the deploy service to initiate the build and deployment process.

### Upload Service
The Upload Service is responsible for handling the initial request from the frontend. When a user provides a GitHub repository URL, this service fetches the project files, uploads them to an S3 bucket, and generates a unique ID, which is then added to the Redis queue. This ensures that deployment requests are processed in an orderly manner.

### Deploy Service
The Deploy Service continuously listens to the Redis queue for new deployment tasks. When a new task appears, it retrieves the corresponding project files from S3, builds the project, and prepares the static files for deployment. Once the deployment is successful, it updates the Redis queue with the deployed status and the URL of the deployed project.

### Request Handler
The Request Handler is responsible for serving the deployed project. After the Deploy Service completes the build, the static files are made available through this service, allowing users to access their deployed applications via the provided URL.

### Frontend
The Frontend is a React-based interface where users can submit their GitHub repository URLs for deployment. It interacts with the Upload Service and Deploy Service and receives the final deployed URL once the process is complete.



