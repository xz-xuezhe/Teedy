pipeline {
 agent any
 stages {
         stage('Build') {
            steps {
             sh 'mvn -B -DskipTests clean package'
            }
         }
        stage('K8s') {
            steps {
                 script {
                    // Docker 登录
                    withCredentials([usernamePassword(credentialsId: 'docker_hub', usernameVariable: 'DOCKER_HUB_USERNAME', passwordVariable: 'DOCKER_HUB_PASSWORD')]) {
                        bat """
                        docker login -u %DOCKER_HUB_USERNAME% -p %DOCKER_HUB_PASSWORD%
                        docker tag teedy_lab11 axelxxy/teedy_local:v1.0
                        """
                    }
                sh 'kubectl set image deployments/hello-node container-name=image-id'
                }
            }
        }
    }
 }
