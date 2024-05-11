// pipeline {
//     agent any
//     stages {
//         stage('Build'){
//             steps {
//                 sh 'mvn -B -DskipTests clean package'
//             }
//         }
//     }
// }

// pipeline {
//     agent any
//     stages {
//         stage('Build') {
//             steps {
//                 sh 'mvn -B -DskipTests clean package'
//             }
//         }
//         stage('Doc') {
//             steps {
//                 sh 'mvn javadoc:jar'
//             }
//         }
//         stage('pmd') {
//             steps {
//                 sh 'mvn pmd:pmd'
//             }
//         }
//         stage('Test report') {
//             steps {
//                 sh 'mvn test --fail-never'
//             }
//         }
//     }
//     post {
//         always {
//             archiveArtifacts artifacts: '**/target/site/**', fingerprint: true
//             archiveArtifacts artifacts: '**/target/**/*.jar', fingerprint: true
//             archiveArtifacts artifacts: '**/target/**/*.war', fingerprint: true
//             archiveArtifacts artifacts: '**/target/surefire-reports/**', fingerprint: true
//         }
//     }
// }


pipeline {
agent any
stages{
stage('Package') {
steps {
checkout scmGit(branches: [[name: '*/master']], extensions: [],
userRemoteConfigs: [[url: 'https://github.com/traccytian/Teedy_2024.git']])
sh 'mvn -B -DskipTests clean package'
}
}
// Building Docker images
stage('Building image') {
steps{
sh 'docker build -t teedy2024_manual'
}
}
// Uploading Docker images into Docker Hub
stage('Upload image') {
steps{
sh 'docker tag teedy2024_manual marineemeow/teedy_local:v1.0'
sh 'docker push marineemeow/teedy_local:v1.0'
}
}
//Running Docker container
stage('Run containers'){
steps{
//your command
sh 'docker build -t teedy2024_manual .'
sh 'docker run -d -p 8084:8080 --name teedy_manual01 teedy2024_manual'
sh 'docker run -d -p 8082:8080 --name teedy_manual02 teedy2024_manual'
sh 'docker run -d -p 8083:8080 --name teedy_manual03 teedy2024_manual'
}
}
}
}