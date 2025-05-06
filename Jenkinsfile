pipeline {
    agent any

    environment {
        // define environment variable
        // Docker Hub Repository's name
        DOCKER_IMAGE = 'xzxuezhe/teedy-app' // your Docker Hub user name and Repository's name
        DOCKER_TAG = "${env.BUILD_NUMBER}" // use build number as tag
    }

    stages {
        stage('Build') {
            steps {
                checkout scmGit(
                    branches: [[name: '*/lab']],
                    extensions: [],
                    userRemoteConfigs: [[
                        url: 'https://github.com/xz-xuezhe/Teedy.git',
                        credentialsId: 'github_fine_grained_token'
                    ]] // your github Repository
                )
                sh 'mvn -B -DskipTests clean package'
            }
        }

        // Building Docker images
        stage('Building image') {
            steps {
                script {
                    // assume Dockerfile locate at root
                    docker.build("${env.DOCKER_IMAGE}:${env.DOCKER_TAG}")
                }
            }
        }

        // Uploading Docker images into Docker Hub
        stage('Upload image') {
            steps {
                script {
                    // sign in Docker Hub
                    docker.withRegistry('https://registry.hub.docker.com', 'dockerhub_credentials') {
                        // push image
                        docker.image("${env.DOCKER_IMAGE}:${env.DOCKER_TAG}").push()
                        // optional: label latest
                        docker.image("${env.DOCKER_IMAGE}:${env.DOCKER_TAG}").push('latest')
                    }
                }
            }
        }

        // Running Docker container
        stage('Run containers') {
            steps {
                script {
                    // stop then remove containers if exists
                    sh 'docker stop teedy-container-8082 || true'
                    sh 'docker rm teedy-container-8082 || true'
                    sh 'docker stop teedy-container-8083 || true'
                    sh 'docker rm teedy-container-8083 || true'
                    sh 'docker stop teedy-container-8084 || true'
                    sh 'docker rm teedy-container-8084 || true'

                    docker.image("${env.DOCKER_IMAGE}:${env.DOCKER_TAG}").run(
                        '--name teedy-container-8082 -d -p 8082:8080'
                    )
                    docker.image("${env.DOCKER_IMAGE}:${env.DOCKER_TAG}").run(
                        '--name teedy-container-8083 -d -p 8082:8080'
                    )
                    docker.image("${env.DOCKER_IMAGE}:${env.DOCKER_TAG}").run(
                        '--name teedy-container-8084 -d -p 8082:8080'
                    )
                }
            }
        }
    }
}
