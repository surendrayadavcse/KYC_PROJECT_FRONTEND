pipeline {
    agent any

    environment {
        IMAGE_NAME = 'surendracse/customerkyc-react'
        DOCKER_IMAGE = 'surendracse/customerkyc-react'
        DOCKER_TAG = "${env.BUILD_NUMBER}"
        DOCKER_CREDENTIALS_ID = 'surendracreds' // Jenkins credentials ID for DockerHub
    }

    stages {
        stage('Clone') {
            steps {
                git url: 'https://github.com/surendrayadavcse/KYC_PROJECT_FRONTEND.git', branch: 'Finalcopyjenkin'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Build React App') {
            steps {
                bat 'npm run build'
            }
        }

        stage('Docker Build') {
            steps {
                bat "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
            }
        }

        stage('Push Docker Image') {
            steps {
                echo "🚀 Pushing Docker image: ${DOCKER_IMAGE}:${DOCKER_TAG}"
                withCredentials([usernamePassword(credentialsId: "${DOCKER_CREDENTIALS_ID}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    bat """
                    echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin
                    docker push ${DOCKER_IMAGE}:${DOCKER_TAG}
                    """
                }
            }
        }
    }

    post {
        success {
            echo "✅ Build and push successful!"
        }
        failure {
            echo "❌ Build failed!"
        }
    }
}
