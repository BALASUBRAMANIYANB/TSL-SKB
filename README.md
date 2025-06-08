# Security Scanner Application

A comprehensive security scanning platform that integrates multiple security tools and provides a unified interface for managing security assessments.

## Features

- Multiple security tool integration (Nmap, OWASP ZAP, Burp Suite, Nikto)
- Wazuh integration for security monitoring
- User authentication and authorization
- Scan scheduling and management
- Report generation
- Real-time scan status updates
- Docker containerization

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Docker

### Frontend
- React
- Redux Toolkit
- Material-UI
- Axios
- Docker

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- MongoDB (if running locally)
- Security tools (Nmap, OWASP ZAP, Burp Suite, Nikto)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd security-scanner
```

2. Install dependencies:
```bash
npm run install:all
```

3. Set up environment variables:
```bash
# Backend (.env)
MONGODB_URI=mongodb://localhost:27017/security-scanner
JWT_SECRET=your-secret-key
PORT=3000

# Frontend (.env)
REACT_APP_API_URL=http://localhost:3000/api
```

4. Start the development servers:
```bash
npm start
```

## Docker Deployment

1. Build and start the containers:
```bash
docker-compose up --build
```

2. Access the application:
- Frontend: http://localhost
- Backend API: http://localhost:3000/api

## Project Structure

```
├── backend/                 # Backend Express API
│   ├── src/
│   │   ├── api/            # API routes and middleware
│   │   ├── config/         # Configuration files
│   │   ├── models/         # Database models
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utility functions
│   └── tests/              # Backend tests
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── store/         # Redux store
│   │   └── utils/         # Utility functions
│   └── tests/             # Frontend tests
└── scripts/               # Deployment scripts
```

## Development

### Backend Development
```bash
cd backend
npm run dev
```

### Frontend Development
```bash
cd frontend
npm start
```

### Running Tests
```bash
# Run all tests
npm test

# Run backend tests
npm run test:backend

# Run frontend tests
npm run test:frontend
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Security

Please report any security issues to security@example.com 