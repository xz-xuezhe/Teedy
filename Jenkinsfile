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

                 sh    'docker login -u axelxxy -p 1qazxsw2_xxy'
                sh 'kubectl set image deployments/hello-node container-name=image-id'
                }
            }
        }
    }
 }
