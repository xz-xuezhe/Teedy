pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                bash 'mvn -B -DskipTests clean package'
            }
        }
    }
}
