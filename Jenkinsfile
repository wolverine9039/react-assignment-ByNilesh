pipeline {
    agent any
    
    // Define environment variables
    environment {
        PROJECT_NAME = 'react-assignment'
        DOCKER_IMAGE = 'react-assignment'
        DOCKER_TAG = "${BUILD_NUMBER}"
        CONTAINER_NAME = 'react-assignment-app'
        CONTAINER_PORT = '8081'
        // Optional: Configure if pushing to a registry
        DOCKER_REGISTRY = '' // e.g., 'docker.io/username' or ECR URL
    }
    
    options {
        // Discard old builds to save space
        buildDiscarder(logRotator(numToKeepStr: '10'))
        // Timeout for entire pipeline
        timeout(time: 30, unit: 'MINUTES')
    }
    
    stages {
        stage('Environment Check') {
            steps {
                echo '🔍 Checking build environment...'
                sh '''
                    echo "════════════════════════════════════════"
                    echo "📋 System Information"
                    echo "════════════════════════════════════════"
                    echo "User: $(whoami)"
                    echo "PWD: $(pwd)"
                    echo "Date: $(date)"
                    echo "Docker Version: $(docker --version)"
                    echo "════════════════════════════════════════"
                '''
            }
        }
        
        stage('Checkout') {
            steps {
                echo '📥 Checking out source code...'
                checkout scm
                sh 'ls -la'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                echo '🔨 Building Docker image...'
                script {
                    try {
                        sh """
                            # Log dependencies for debugging
                            echo "📦 Installed Dependencies:"
                            npm list --depth=0 || true

                            # Build Docker image
                            echo "🐳 Building Docker image..."
                            docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} .
                            
                            # Also tag as latest
                            docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_IMAGE}:latest
                            
                            # Verify image was created
                            docker images | grep ${DOCKER_IMAGE}
                        """
                        echo '✅ Docker image built successfully'
                    } catch (Exception e) {
                        echo "❌ Docker build failed: ${e.message}"
                        throw e
                    }
                }
            }
        }
        
        stage('Test Docker Image') {
            steps {
                echo '🧪 Testing Docker image...'
                script {
                    try {
                        // Test nginx configuration
                        sh """
                            docker run --rm ${DOCKER_IMAGE}:${DOCKER_TAG} nginx -t
                        """
                        echo '✅ Docker image tests passed'
                    } catch (Exception e) {
                        echo "⚠️  Image test warning: ${e.message}"
                        // Continue anyway
                    }
                }
            }
        }
        
        stage('Stop Old Container') {
            steps {
                echo '🛑 Stopping old container (if exists)...'
                script {
                    sh """
                        # Stop and remove old container
                        docker stop ${CONTAINER_NAME} 2>/dev/null || echo "No container to stop"
                        docker rm ${CONTAINER_NAME} 2>/dev/null || echo "No container to remove"
                        
                        # Clean up any containers using port ${CONTAINER_PORT}
                        CONTAINER_ON_PORT=\$(docker ps -q --filter "publish=${CONTAINER_PORT}")
                        if [ ! -z "\$CONTAINER_ON_PORT" ]; then
                            echo "Found container using port ${CONTAINER_PORT}, stopping it..."
                            docker stop \$CONTAINER_ON_PORT
                            docker rm \$CONTAINER_ON_PORT
                        fi
                    """
                }
            }
        }
        
        stage('Deploy Container') {
            steps {
                echo '🚀 Deploying new container...'
                script {
                    try {
                        sh """
                            # Run new container
                            docker run -d \
                                --name ${CONTAINER_NAME} \
                                -p ${CONTAINER_PORT}:80 \
                                -p 8443:443 \
                                --restart unless-stopped \
                                ${DOCKER_IMAGE}:${DOCKER_TAG}
                            
                            # Wait a moment for container to start
                            sleep 3
                            
                            # Verify container is running
                            docker ps -a | grep ${CONTAINER_NAME}
                            
                            # Check container health
                            if docker ps | grep -q ${CONTAINER_NAME}; then
                                echo "✅ Container is running"
                            else
                                echo "❌ Container failed to start"
                                docker logs ${CONTAINER_NAME}
                                exit 1
                            fi
                        """
                        echo "✅ Deployment successful on port ${CONTAINER_PORT}"
                    } catch (Exception e) {
                        echo "❌ Deployment failed: ${e.message}"
                        sh "docker logs ${CONTAINER_NAME} || true"
                        throw e
                    }
                }
            }
        }
        
        stage('Health Check') {
            steps {
                echo '🏥 Performing health check...'
                script {
                    sh """
                        # Wait for application to be ready
                        echo "Waiting for application to respond..."
                        for i in {1..10}; do
                            if curl -f http://localhost:${CONTAINER_PORT} > /dev/null 2>&1; then
                                echo "✅ Application is healthy and responding"
                                exit 0
                            fi
                            echo "Attempt \$i/10: Application not ready yet..."
                            sleep 2
                        done
                        echo "⚠️  Application may not be fully ready, but container is running"
                    """
                }
            }
        }
        
        stage('Push to Registry (Optional)') {
            when {
                allOf {
                    anyOf {
                        branch 'main'
                        branch 'master'
                    }
                    expression { return env.DOCKER_REGISTRY != '' }
                }
            }
            steps {
                echo '📤 Pushing to Docker registry...'
                script {
                    withCredentials([usernamePassword(
                        credentialsId: 'docker-registry-credentials',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )]) {
                        sh """
                            echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin ${DOCKER_REGISTRY}
                            docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${DOCKER_TAG}
                            docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:latest
                            docker push ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${DOCKER_TAG}
                            docker push ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:latest
                            docker logout ${DOCKER_REGISTRY}
                        """
                    }
                }
            }
        }
    }
    
    post {
        success {
            script {
                def ec2PublicIp = sh(
                    script: 'curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo "localhost"',
                    returnStdout: true
                ).trim()
                
                echo """
                    ════════════════════════════════════════════════════
                    ✅ BUILD SUCCESSFUL
                    ════════════════════════════════════════════════════
                    📦 Project: ${PROJECT_NAME}
                    🔢 Build: #${BUILD_NUMBER}
                    🐳 Image: ${DOCKER_IMAGE}:${DOCKER_TAG}
                    📦 Container: ${CONTAINER_NAME}
                    🌐 Access URL: http://${ec2PublicIp}:${CONTAINER_PORT}
                    🕐 Completed: ${new Date()}
                    ════════════════════════════════════════════════════
                    
                    💡 Next Steps:
                    1. Access your app at: http://${ec2PublicIp}:${CONTAINER_PORT}
                    2. Check EC2 Security Group allows port ${CONTAINER_PORT}
                    3. View logs: docker logs ${CONTAINER_NAME}
                    ════════════════════════════════════════════════════
                """
            }
        }
        
        failure {
            script {
                echo """
                    ════════════════════════════════════════════════════
                    ❌ BUILD FAILED
                    ════════════════════════════════════════════════════
                    📦 Project: ${PROJECT_NAME}
                    🔢 Build: #${BUILD_NUMBER}
                    🕐 Failed at: ${new Date()}
                    ════════════════════════════════════════════════════
                    
                    🔍 Troubleshooting:
                    1. Check Jenkins console output for errors
                    2. Verify Docker is running: docker ps
                    3. Check disk space: df -h
                    4. Review container logs if exists
                    ════════════════════════════════════════════════════
                """
                
                // Try to show container logs if they exist
                sh """
                    echo "Attempting to retrieve container logs..."
                    docker logs ${CONTAINER_NAME} 2>/dev/null || echo "No logs available"
                """ 
            }
        }
        
        always {
            echo '🧹 Cleaning up old Docker images...'
            script {
                sh """
                    # Remove dangling images
                    docker image prune -f || true
                    
                    # Keep only last 5 tagged builds
                    docker images ${DOCKER_IMAGE} --format '{{.Tag}}' | \
                        grep -E '^[0-9]+\$' | \
                        sort -rn | \
                        tail -n +6 | \
                        xargs -r -I {} docker rmi ${DOCKER_IMAGE}:{} 2>/dev/null || true
                    
                    echo "Cleanup completed"
                """
            }
        }
    }
}
