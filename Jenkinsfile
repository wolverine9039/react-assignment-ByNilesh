pipeline {
    agent any
    
    environment {
        DOCKER_SERVER = '18.233.121.184'
        APP_URL = "reactbynilesh.buildwithmayank.tech"
    }
    
    stages {
        stage('Git Checkout') {
            steps {
                echo "Checking out code from GitHub..."
                git url: "https://github.com/wolverine9039/react-assignment-ByNilesh.git", branch: "main"
            }
        }
        
        stage('Test SSH Connection') {
            steps {
                sh '''
                    echo "Testing SSH connection..."
                    ssh -i /var/lib/jenkins/.ssh/id_ed25519 \
                        -o StrictHostKeyChecking=no \
                        root@${DOCKER_SERVER} "echo SSH connection successful!"
                '''
            }
        }
        
        stage('Deploy with Ansible') {
            steps {
                sh '''
                    ANSIBLE_HOST_KEY_CHECKING=False \
                    ansible-playbook /var/lib/jenkins/playbooks/react_deployment.yaml \
                    -i "${DOCKER_SERVER}," \
                    -u root \
                    --private-key /var/lib/jenkins/.ssh/id_ed25519 \
                    -e "workspace_path=${WORKSPACE}" \
                    -v
                '''
            }
        }
    }
    
    post {
        success {
            echo "✅ Deployment successful! Access at: https://${APP_URL}"
        }
        failure {
            echo '❌ Deployment failed. Check logs for details.'
        }
    }
}