 pipeline {
 agent any
 stages {
 stage('Build') { 
steps {
 bat 'mvn -B -DskipTests clean package' 
}
 }
 stage('K8s') {
 steps {
 bat 'kubectl set image deployments/hello-node axelxxy/teedy_local:v1.0'
 }
 }
 }
 }
