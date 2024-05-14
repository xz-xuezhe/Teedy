pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                pwsh 'mvn -B -U -DskipTests clean package -X'
            }
        }
        stage('pmd') {
            steps {
                pwsh 'mvn pmd:pmd'
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: '**/target/site/**', fingerprint: true
            archiveArtifacts artifacts: '**/target/**/*.jar', fingerprint: true
            archiveArtifacts artifacts: '**/target/**/*.war', fingerprint: true
        }
    }
}
