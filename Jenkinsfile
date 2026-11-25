pipeline {
    agent any

    tools {
        nodejs 'NodeJS-22'
    }

    environment {
        IMAGE_NAME = 'jenkins-sonar-prod'
        IMAGE_TAG  = "${env.BUILD_NUMBER}"
        CONTAINER_NAME = 'react-cicd-app'
        APP_PORT   = '80'
        SCANNER_HOME = tool 'SonarQube-Scanner'
    }

    stages {
        stage('Checkout GitHub') {
            steps {
                checkout scm
            }
        }

        stage('Install & Unit Test') {
            steps {
                sh 'npm ci'
                sh 'npm test'
            }
        }

        stage('Build Static Bundle') {
            steps {
                sh 'npm run build'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube-Server') {
                    sh """
                        ${SCANNER_HOME}/bin/sonar-scanner \
                          -Dsonar.projectKey=jenkins-sonar-prod \
                          -Dsonar.sources=src
                    """
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Docker Build') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} -t ${IMAGE_NAME}:latest ."
            }
        }

        stage('Deploy Container') {
            steps {
                sh """
                    docker rm -f ${CONTAINER_NAME} || true
                    docker run -d --name ${CONTAINER_NAME} --restart unless-stopped -p ${APP_PORT}:80 ${IMAGE_NAME}:${IMAGE_TAG}
                """
            }
        }
    }

    post {
        always {
            sh 'docker image prune -f'
        }
    }
}

