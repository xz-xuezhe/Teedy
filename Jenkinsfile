pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                pwsh 'mvn -B -DskipTests clean package'
            }
        }
    }
}
