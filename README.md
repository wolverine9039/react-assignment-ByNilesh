# React Assignment - ByNilesh

A modern React application built with Vite, featuring automated CI/CD deployment using Jenkins, Docker, and AWS EC2.

## 🚀 Live Demo

**Deployment URL**: `http://<EC2-PUBLIC-IP>:8081`

> The application is automatically deployed via Jenkins CI/CD pipeline on every push to the repository.

## 📋 Tech Stack

- **Frontend**: React 19.2.0
- **Build Tool**: Vite 7.3.1
- **Deployment**: Docker + nginx
- **CI/CD**: Jenkins Pipeline
- **Infrastructure**: AWS EC2
- **Container Orchestration**: Docker Compose

## 🏗️ Architecture

```
GitHub Repository → Jenkins (CI/CD) → Docker Build → EC2 Deployment → Port 8081
```

## 🛠️ Local Development

### Prerequisites
- Node.js 20+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd react-assignment-ByNilesh

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🐳 Docker Deployment

### Build and Run with Docker

```bash
# Build Docker image
docker build -t react-assignment:latest .

# Run container
docker run -d -p 8081:80 --name react-assignment-app react-assignment:latest

# View logs
docker logs react-assignment-app

# Stop container
docker stop react-assignment-app
```

### Using Docker Compose

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🔄 CI/CD Pipeline

The project uses Jenkins for automated deployment with the following stages:

1. **Environment Check** - Verify build environment
2. **Checkout** - Pull latest code
3. **Build Docker Image** - Create production image
4. **Test Docker Image** - Validate nginx configuration
5. **Stop Old Container** - Clean up previous deployment
6. **Deploy Container** - Run new container on port 8081
7. **Health Check** - Verify application is responding

### Pipeline Features
- Automated builds on code push
- Docker image tagging with build numbers
- Health checks and rollback capability
- Automatic cleanup of old images
- Build retention (last 10 builds)

## 📦 Project Structure

```
react-assignment-ByNilesh/
├── src/                    # Source files
│   ├── App.jsx            # Main application component
│   ├── App.css            # Application styles
│   ├── main.jsx           # Entry point
│   └── constants/         # Constants and configuration
├── public/                # Static assets
├── Dockerfile             # Multi-stage Docker build
├── docker-compose.yml     # Docker Compose configuration
├── Jenkinsfile           # Jenkins CI/CD pipeline
├── nginx.conf            # Nginx server configuration
├── generate-ssl-cert.sh  # SSL certificate generation
└── package.json          # Dependencies and scripts
```

## 🔧 Configuration

### Environment Variables
No environment variables required for basic deployment.

### Port Configuration
- **Development**: 5173 (Vite default)
- **Production**: 8081 (mapped to container port 80)
- **HTTPS**: 8443 (mapped to container port 443)

## 🚀 Deployment Instructions

### Manual Deployment to EC2

1. **SSH into EC2 instance**
   ```bash
   ssh -i your-key.pem ubuntu@<EC2-PUBLIC-IP>
   ```

2. **Clone repository**
   ```bash
   git clone <repository-url>
   cd react-assignment-ByNilesh
   ```

3. **Build and deploy**
   ```bash
   docker-compose up -d
   ```

4. **Verify deployment**
   ```bash
   curl http://localhost:8081
   ```

### Automated Deployment via Jenkins

1. Push code to GitHub repository
2. Jenkins webhook triggers pipeline automatically
3. Pipeline builds Docker image and deploys to EC2
4. Access application at `http://<EC2-PUBLIC-IP>:8081`

## 🔒 Security

- HTTPS support with self-signed SSL certificates
- Security headers configured in nginx
- Gzip compression enabled
- Static asset caching

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is part of a training assignment.

## 👤 Author

**Nilesh**

---

Built with ❤️ using React + Vite + Docker + Jenkins

