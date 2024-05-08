pipeline {
    agent any

    tools {
        // 确保 Maven 和 JDK 被正确设置
        maven 'Maven3' // 此处的 'Maven3' 需要替换为您 Jenkins 中配置的 Maven 工具名称
        jdk 'JDK8' // 替换为您 Jenkins 中配置的 JDK
    }

    stages {
        stage('Build') {
            steps {
                bat 'mvn -B clean package'
            }
        }
        stage('Test') {
            steps {
                // 运行测试并生成 surefire 报告
                bat 'mvn test'
            }
            post {
                always {
                    // 把 surefire 报告归档
                    archiveArtifacts artifacts: '**/target/surefire-reports/*.xml', fingerprint: true
                }
            }
        }
        stage('Generate Javadoc') {
            steps {
                // 生成 javadoc
                bat 'mvn javadoc:javadoc javadoc:jar'
            }
            post {
                always {
                    // 把 javadoc JAR 文件归档
                    archiveArtifacts artifacts: '**/target/*-javadoc.jar', fingerprint: true
                }
            }
        }
        stage('pmd') {
            steps {
                bat 'mvn pmd:pmd'
            }
        }
    }

    post {
        always {
            // 归档网站和 JAR/WAR 文件
            archiveArtifacts artifacts: '**/target/site/**', fingerprint: true
            archiveArtifacts artifacts: '**/target/**/*.jar', fingerprint: true
            archiveArtifacts artifacts: '**/target/**/*.war', fingerprint: true
        }
    }
}
