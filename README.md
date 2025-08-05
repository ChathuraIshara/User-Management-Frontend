# User Management Frontend

A React + TypeScript frontend application for managing users with full CRUD operations, built with Vite and styled with Tailwind CSS.

## Features

- 🔐 User Management (Create, Read, Update, Delete)
- 🎨 Modern UI with Tailwind CSS
- 📱 Responsive Design
- ✅ Form Validation
- 🔄 Real-time Updates
- 🎯 Modal Components
- 🐳 Docker Support

## Tech Stack

- **Frontend:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios (assumed)
- **Containerization:** Docker

## Prerequisites

- Node.js 20+ 
- npm or yarn
- Docker (for containerized deployment)

## Running Locally

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd user-api-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=api/usersDemo
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at: `http://localhost:5173`

### 5. Build for Production

```bash
npm run build
npm run preview
```

## Running with Docker

### Option 1: Quick Start (Uses Default Local API)

```bash
# Build the Docker image
docker build --build-arg VITE_API_BASE_URL=http://localhost:5000/api/usersDemo -t user-api-frontend .

# Run the container
docker run --name user-frontend -p 3000:3000 user-api-frontend
```

The application will be available at: `http://localhost:3000`


## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_API_BASE_URL` | Backend API base URL | None | ✅ |

### Environment Examples

```bash
# Local Development
VITE_API_BASE_URL=http://localhost:5000/api/usersDemo
```



## Project Structure

```
├── public/                 # Static assets
├── src/
│   ├── components/        # React components
│   ├── assets/           # Images, icons
│   ├── App.tsx           # Main app component
│   └── main.tsx          # Entry point
├── Dockerfile            # Docker configuration
├── .dockerignore         # Docker ignore rules
├── vite.config.ts        # Vite configuration
├── package.json          # Dependencies
└── README.md            # This file
```

## Development Workflow

### Local Development
1. Start your backend API server on `localhost:5000`
2. Run `npm run dev`
3. Access frontend at `http://localhost:5173`

### Docker Development
1. Start your backend API server on your host machine
2. Run container and access at `http://localhost:3000`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally and with Docker
5. Submit a pull request

**Need Help?** 
- Check the troubleshooting section above
- Review Docker logs: `docker logs user-frontend`
- Ensure your backend API is running and accessible
