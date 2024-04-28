pipeline {
    agent any
    stages {
        stage('Build') { 
            steps {
                sh 'mvn -B -DskipTests clean package' 
            }
        }
        // stage('pmd') {
        //     steps {
        //         sh 'mvn pmd:pmd'
        //     }
        // }
    }

    post {
        always {
            archiveArtifacts artifacts: 'docs-core/target/site/**', fingerprint: true
            archiveArtifacts artifacts: 'docs-web/target/site/**', fingerprint: true
            archiveArtifacts artifacts: 'docs-web-common/target/site/**', fingerprint: true
        }
    }
}