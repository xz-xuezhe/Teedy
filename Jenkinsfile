pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                cmd.exe 'mvn -B -DskipTests clean package'
            }
        }
    }
}
