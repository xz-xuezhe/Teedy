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
                sh 'kubectl set image deployment/hello-node teedy-local-mz6hb=axelxxy/teedy_local:v1.0'
                }
            }
        }
 }
