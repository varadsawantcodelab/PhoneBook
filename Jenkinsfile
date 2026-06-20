pipeline {
    agent any
    
    environment {
        DOCKER_USER     = 'varadsawantdockerlab'
        IMAGE_NAME      = 'phonebook' 
        IMAGE_TAG       = "${BUILD_NUMBER}"
        REGISTRY_CREDS  = 'dockerhub-creds' 
    }
    
    stages {
        
        stage('Build Frontend & Backend') {
            steps {
                echo 'Building Frontend and Backend Docker images...'
                script {
                    // 1. Frontend (Builds from your frontend folder)
                    sh "docker build -t ${DOCKER_USER}/${IMAGE_NAME}:frontend-${IMAGE_TAG} ./frontend"
                    sh "docker tag ${DOCKER_USER}/${IMAGE_NAME}:frontend-${IMAGE_TAG} ${DOCKER_USER}/${IMAGE_NAME}:frontend-latest"
                    
                    // 2. Backend (Builds from your backend folder)
                    sh "docker build -t ${DOCKER_USER}/${IMAGE_NAME}:backend-${IMAGE_TAG} ./backend"
                    sh "docker tag ${DOCKER_USER}/${IMAGE_NAME}:backend-${IMAGE_TAG} ${DOCKER_USER}/${IMAGE_NAME}:backend-latest"
                }
            }
        }
        
        stage('Push to DockerHub') {
            steps {
                echo 'Pushing images to the single DockerHub repository...'
                withCredentials([usernamePassword(credentialsId: env.REGISTRY_CREDS, usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh "echo ${PASS} | docker login -u ${USER} --password-stdin"
                    
                    // Push Frontend tags
                    sh "docker push ${DOCKER_USER}/${IMAGE_NAME}:frontend-${IMAGE_TAG}"
                    sh "docker push ${DOCKER_USER}/${IMAGE_NAME}:frontend-latest"
                    
                    // Push Backend tags
                    sh "docker push ${DOCKER_USER}/${IMAGE_NAME}:backend-${IMAGE_TAG}"
                    sh "docker push ${DOCKER_USER}/${IMAGE_NAME}:backend-latest"
                }
            }
        }
        
        stage('Deploy Stack to KinD Cluster') {
            steps {
                echo 'Updating image tags in phonebook-stack.yaml and deploying...'
                script {
                    // Update the frontend and backend image tags directly inside the root manifest file
                    sh "sed -i 's|image: ${DOCKER_USER}/${IMAGE_NAME}:frontend.*|image: ${DOCKER_USER}/${IMAGE_NAME}:frontend-${IMAGE_TAG}|g' phonebook-stack.yaml"
                    sh "sed -i 's|image: ${DOCKER_USER}/${IMAGE_NAME}:backend.*|image: ${DOCKER_USER}/${IMAGE_NAME}:backend-${IMAGE_TAG}|g' phonebook-stack.yaml"
                    
                    // Deploy the unified stack file to KinD
                    sh "kubectl apply -f phonebook-stack.yaml"
                }
            }
        }
    }
    
    post {
        always {
            echo 'Cleaning up host Docker images...'
            sh "docker rmi ${DOCKER_USER}/${IMAGE_NAME}:frontend-${IMAGE_TAG} ${DOCKER_USER}/${IMAGE_NAME}:backend-${IMAGE_TAG} || true"
            sh "docker logout"
        }
    }
}
